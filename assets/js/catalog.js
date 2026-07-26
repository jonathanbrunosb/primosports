/* =========================================================================
   Catálogo: render dos cards, busca em tempo real, filtros e ordenação.
   Todo texto vindo de dados usa textContent — nunca innerHTML.
   ========================================================================= */

const Favorites = {
  ids: [],
  load() { this.ids = readCollection(STORAGE_KEYS.favorites).filter((id) => !!findProduct(id)); return this.ids; },
  has(id) { return this.ids.includes(id); },
  toggle(id) {
    const i = this.ids.indexOf(id);
    if (i >= 0) this.ids.splice(i, 1); else this.ids.push(id);
    writeCollection(STORAGE_KEYS.favorites, this.ids);
    document.dispatchEvent(new CustomEvent('favorites:change'));
    return this.has(id);
  }
};

const Catalog = {
  grid: null,
  countEl: null,
  chipsEl: null,
  state: {
    query: '',
    categories: [],
    teams: [],
    seasons: [],
    models: [],
    sizes: [],
    versions: [],
    availability: [], // 'ready' | 'order'
    flags: [], // 'bestSeller' | 'newArrival' | 'personalization'
    sort: 'featured',
    limit: 0 // 0 = sem limite
  },

  init(options) {
    const opts = options || {};
    this.grid = document.getElementById(opts.gridId || 'productGrid');
    if (!this.grid) return;
    this.countEl = document.getElementById(opts.countId || 'resultCount');
    this.chipsEl = document.getElementById(opts.chipsId || 'activeFilters');
    this.state.limit = opts.limit || 0;
    if (opts.sort) this.state.sort = opts.sort;

    this.showSkeleton();
    this.buildFilters();
    this.bindControls();
    this.readStateFromUrl();
    // Render no próximo frame: o skeleton aparece e evita layout shift.
    requestAnimationFrame(() => this.render());
  },

  /**
   * Monta as opções de filtro a partir dos próprios produtos, para que a
   * lista nunca fique desatualizada em relação ao catálogo.
   */
  buildFilters() {
    const unique = (fn) => Array.from(new Set(PRODUCTS.map(fn))).sort((a, b) => a.localeCompare(b, 'pt-BR'));
    const sources = {
      categories: unique((p) => p.category),
      teams: unique((p) => p.team),
      seasons: unique((p) => p.season),
      models: unique((p) => p.model),
      versions: unique((p) => p.version),
      sizes: SIZE_ORDER.slice()
    };

    document.querySelectorAll('[data-filter-source]').forEach((container) => {
      const group = container.dataset.filterSource;
      const values = sources[group];
      if (!values) return;
      container.replaceChildren();
      values.forEach((value) => {
        const id = `f-${group}-${value.replace(/[^a-zA-Z0-9]/g, '')}`;
        const label = document.createElement('label');
        label.className = 'check';
        label.setAttribute('for', id);
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = id;
        input.value = value;
        input.dataset.filterGroup = group;
        label.append(input, document.createTextNode(value));
        container.appendChild(label);
      });
    });
  },

  /* ------------------------------------------------------------- controles */
  bindControls() {
    const search = document.getElementById('searchInput');
    if (search) {
      let t;
      search.addEventListener('input', () => {
        clearTimeout(t);
        t = setTimeout(() => {
          this.state.query = search.value.trim();
          this.render();
        }, 160);
      });
    }

    const sort = document.getElementById('sortSelect');
    if (sort) {
      sort.addEventListener('change', () => {
        this.state.sort = sort.value;
        this.render();
      });
    }

    document.querySelectorAll('[data-filter-group]').forEach((input) => {
      input.addEventListener('change', () => {
        const group = input.dataset.filterGroup;
        const value = input.value;
        const list = this.state[group];
        if (!Array.isArray(list)) return;
        const i = list.indexOf(value);
        if (input.checked && i < 0) list.push(value);
        if (!input.checked && i >= 0) list.splice(i, 1);
        this.render();
      });
    });

    const clear = document.getElementById('clearFilters');
    if (clear) clear.addEventListener('click', () => this.clearFilters());

    const toggle = document.getElementById('filtersToggle');
    const panel = document.getElementById('filtersPanel');
    if (toggle && panel) {
      toggle.addEventListener('click', () => {
        const open = panel.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
      });
    }
  },

  /** Lê ?categoria= / ?busca= da URL para links vindos da home. */
  readStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('categoria');
    const query = params.get('busca');
    if (category) {
      this.state.categories = [category];
      const input = document.querySelector(`[data-filter-group="categories"][value="${CSS.escape(category)}"]`);
      if (input) input.checked = true;
    }
    if (query) {
      this.state.query = query;
      const search = document.getElementById('searchInput');
      if (search) search.value = query;
    }
  },

  clearFilters() {
    this.state.query = '';
    ['categories', 'teams', 'seasons', 'models', 'sizes', 'versions', 'availability', 'flags'].forEach((k) => {
      this.state[k] = [];
    });
    document.querySelectorAll('[data-filter-group]').forEach((i) => { i.checked = false; });
    const search = document.getElementById('searchInput');
    if (search) search.value = '';
    this.render();
  },

  /* ---------------------------------------------------------------- filtro */
  matches(product) {
    const s = this.state;

    if (s.query) {
      const haystack = [
        product.team, product.season, product.model, product.category,
        product.subcategory, product.version, product.sku, product.name
      ].join(' ').toLowerCase();
      const terms = s.query.toLowerCase().split(/\s+/).filter(Boolean);
      if (!terms.every((term) => haystack.includes(term))) return false;
    }

    if (s.categories.length && !s.categories.includes(product.category)) return false;
    if (s.teams.length && !s.teams.includes(product.team)) return false;
    if (s.seasons.length && !s.seasons.includes(product.season)) return false;
    if (s.models.length && !s.models.includes(product.model)) return false;
    if (s.versions.length && !s.versions.includes(product.version)) return false;

    if (s.sizes.length) {
      const ok = s.sizes.some((size) => {
        const info = product.sizes[size];
        return info && SIZE_STATUS[info.status].selectable;
      });
      if (!ok) return false;
    }

    if (s.availability.length) {
      const ready = productAvailability(product) === 'available' || productAvailability(product) === 'low_stock';
      const wantsReady = s.availability.includes('ready');
      const wantsOrder = s.availability.includes('order');
      if (wantsReady && !wantsOrder && !ready) return false;
      if (wantsOrder && !wantsReady && ready) return false;
    }

    if (s.flags.includes('bestSeller') && !product.bestSeller) return false;
    if (s.flags.includes('newArrival') && !product.newArrival) return false;
    if (s.flags.includes('personalization') && !product.personalizationAvailable) return false;

    return true;
  },

  sorted(list) {
    const rank = { available: 0, low_stock: 1, pre_order: 2, unavailable: 3 };
    const copy = list.slice();
    switch (this.state.sort) {
      case 'name':
        return copy.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
      case 'availability':
        return copy.sort((a, b) => rank[productAvailability(a)] - rank[productAvailability(b)] || a.team.localeCompare(b.team, 'pt-BR'));
      default:
        return copy.sort((a, b) => {
          const score = (p) => (p.featured ? 4 : 0) + (p.bestSeller ? 2 : 0) + (p.newArrival ? 1 : 0);
          return score(b) - score(a) || a.team.localeCompare(b.team, 'pt-BR');
        });
    }
  },

  /* ---------------------------------------------------------------- render */
  showSkeleton() {
    this.grid.setAttribute('aria-busy', 'true');
    this.grid.replaceChildren();
    for (let i = 0; i < (this.state.limit || 8); i += 1) {
      const card = document.createElement('div');
      card.className = 'skeleton-card';
      card.innerHTML =
        '<div class="skeleton-block sk-img"></div><div class="skeleton-block sk-line"></div><div class="skeleton-block sk-line short"></div>';
      this.grid.appendChild(card);
    }
  },

  render() {
    if (!this.grid) return;
    let list;
    try {
      list = this.sorted(PRODUCTS.filter((p) => this.matches(p)));
    } catch (error) {
      this.renderError();
      return;
    }

    const total = list.length;
    if (this.state.limit) list = list.slice(0, this.state.limit);

    this.grid.replaceChildren();
    this.grid.setAttribute('aria-busy', 'false');

    if (!total) {
      this.renderEmpty();
    } else {
      const frag = document.createDocumentFragment();
      list.forEach((product, i) => frag.appendChild(this.buildCard(product, i)));
      this.grid.appendChild(frag);
    }

    this.renderCount(total);
    this.renderChips();
    this.syncUrl();
  },

  renderCount(total) {
    if (!this.countEl) return;
    this.countEl.replaceChildren();
    const b = document.createElement('b');
    b.textContent = String(total);
    this.countEl.append(b, document.createTextNode(total === 1 ? ' produto encontrado' : ' produtos encontrados'));
  },

  renderChips() {
    if (!this.chipsEl) return;
    this.chipsEl.replaceChildren();
    const groups = [
      ['categories', 'Categoria'], ['teams', 'Time'], ['seasons', 'Temporada'],
      ['models', 'Modelo'], ['sizes', 'Tamanho'], ['versions', 'Versão']
    ];
    groups.forEach(([key, label]) => {
      this.state[key].forEach((value) => {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.append(document.createTextNode(`${label}: ${value}`));
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = '×';
        btn.setAttribute('aria-label', `Remover filtro ${label} ${value}`);
        btn.addEventListener('click', () => {
          this.state[key] = this.state[key].filter((v) => v !== value);
          const input = document.querySelector(`[data-filter-group="${key}"][value="${CSS.escape(value)}"]`);
          if (input) input.checked = false;
          this.render();
        });
        chip.appendChild(btn);
        this.chipsEl.appendChild(chip);
      });
    });
  },

  renderEmpty() {
    const box = document.createElement('div');
    box.className = 'state-box';
    const h = document.createElement('h3');
    h.textContent = 'Nenhuma camisa encontrada';
    const p = document.createElement('p');
    p.textContent = 'Tente outro time, temporada ou limpe os filtros. Se você procura um modelo específico, fale com a gente: podemos consultar disponibilidade.';
    const actions = document.createElement('div');
    actions.className = 'hero-cta';
    actions.style.justifyContent = 'center';

    const clear = document.createElement('button');
    clear.type = 'button';
    clear.className = 'btn btn-outline';
    clear.textContent = 'Limpar filtros';
    clear.addEventListener('click', () => this.clearFilters());

    const wa = document.createElement('button');
    wa.type = 'button';
    wa.className = 'btn btn-wa';
    wa.textContent = 'Consultar no WhatsApp';
    wa.addEventListener('click', () => {
      const term = this.state.query ? ` Procuro por: ${this.state.query}.` : '';
      openWhatsApp(buildSimpleMessage(`Não encontrei o modelo que eu queria no catálogo.${term}`));
    });

    actions.append(clear, wa);
    box.append(h, p, actions);
    this.grid.appendChild(box);
  },

  renderError() {
    this.grid.replaceChildren();
    this.grid.setAttribute('aria-busy', 'false');
    const box = document.createElement('div');
    box.className = 'state-box error';
    const h = document.createElement('h3');
    h.textContent = 'Não conseguimos carregar o catálogo';
    const p = document.createElement('p');
    p.textContent = 'Atualize a página. Se o problema continuar, fale com a gente pelo WhatsApp que enviamos o catálogo por lá.';
    box.append(h, p);
    this.grid.appendChild(box);
  },

  /** Mantém categoria e busca na URL (query string, sem risco de 404). */
  syncUrl() {
    if (!document.body.dataset.syncUrl) return;
    const params = new URLSearchParams();
    if (this.state.categories.length === 1) params.set('categoria', this.state.categories[0]);
    if (this.state.query) params.set('busca', this.state.query);
    const qs = params.toString();
    const url = `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`;
    window.history.replaceState(null, '', url);
  },

  /* ------------------------------------------------------------------ card */
  buildCard(product, index) {
    const availability = productAvailability(product);
    const card = document.createElement('article');
    card.className = 'product-card';
    if (availability === 'unavailable') card.classList.add('is-unavailable');

    /* Visual */
    const visual = document.createElement('div');
    visual.className = 'product-visual';

    const img = document.createElement('img');
    img.src = product.imagesPending ? product.placeholder : product.images[0].src;
    img.alt = `Camisa ${product.team} ${product.model} ${product.season} — versão ${product.version}`;
    img.width = 600;
    img.height = 600;
    img.decoding = 'async';
    if (index > 3) img.loading = 'lazy';
    visual.appendChild(img);

    const tags = document.createElement('div');
    tags.className = 'product-tags';
    if (product.bestSeller) tags.appendChild(makeTag('Mais vendida', 'tag-best'));
    if (product.newArrival) tags.appendChild(makeTag('Lançamento', 'tag-new'));
    if (availability === 'available') tags.appendChild(makeTag('Pronta entrega', 'tag-ready'));
    if (availability === 'low_stock') tags.appendChild(makeTag('Últimas unidades', 'tag-low'));
    if (availability === 'pre_order') tags.appendChild(makeTag('Sob encomenda', 'tag-order'));
    if (availability === 'unavailable') tags.appendChild(makeTag('Indisponível', 'tag-off'));
    visual.appendChild(tags);

    const fav = document.createElement('button');
    fav.type = 'button';
    fav.className = 'favorite';
    fav.setAttribute('aria-pressed', String(Favorites.has(product.id)));
    fav.setAttribute('aria-label', `Favoritar ${product.name}`);
    fav.appendChild(icon('heart'));
    fav.addEventListener('click', () => {
      const active = Favorites.toggle(product.id);
      fav.setAttribute('aria-pressed', String(active));
      showToast(active ? 'Adicionado aos favoritos.' : 'Removido dos favoritos.');
    });
    visual.appendChild(fav);
    card.appendChild(visual);

    /* Informações */
    const info = document.createElement('div');
    info.className = 'product-info';

    const cat = document.createElement('span');
    cat.className = 'product-category';
    cat.textContent = product.category;

    const name = document.createElement('h3');
    name.className = 'product-name';
    name.textContent = `${product.team} ${product.season}`;

    const meta = document.createElement('p');
    meta.className = 'product-meta';
    meta.textContent = `${product.model} · Versão ${product.version} · ${product.sku}`;

    const status = document.createElement('p');
    status.className = `product-status ${{ available: 'ok', low_stock: 'low', pre_order: 'order', unavailable: 'off' }[availability]}`;
    status.textContent = SIZE_STATUS[availability].label;

    const priceRow = document.createElement('div');
    priceRow.className = 'product-price-row';
    const price = document.createElement('strong');
    price.className = 'product-price';
    price.textContent = formatPrice(product.priceReference);
    const priceNote = document.createElement('span');
    priceNote.className = 'product-price-note';
    priceNote.textContent = 'valor de referência';
    priceRow.append(price, priceNote);

    const actions = document.createElement('div');
    actions.className = 'product-actions';

    const details = document.createElement('button');
    details.type = 'button';
    details.className = 'btn btn-primary btn-sm btn-block';
    details.textContent = 'Ver detalhes';
    details.addEventListener('click', () => ProductModal.open(product.id));

    const row = document.createElement('div');
    row.className = 'row';

    const wa = document.createElement('button');
    wa.type = 'button';
    wa.className = 'btn btn-outline btn-sm';
    wa.textContent = 'WhatsApp';
    wa.setAttribute('aria-label', `Consultar ${product.name} no WhatsApp`);
    wa.addEventListener('click', () => openWhatsApp(buildProductMessage(product, {})));

    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'btn btn-outline btn-sm';
    add.textContent = 'Orçamento';
    add.setAttribute('aria-label', `Adicionar ${product.name} ao orçamento`);
    if (availability === 'unavailable') {
      add.disabled = true;
      add.title = 'Produto indisponível';
    } else {
      // Tamanho é obrigatório: o card envia para o modal, onde o cliente escolhe.
      add.addEventListener('click', () => {
        ProductModal.open(product.id);
        showToast('Selecione o tamanho para adicionar ao orçamento.');
      });
    }

    row.append(wa, add);
    actions.append(details, row);
    info.append(cat, name, meta, status, priceRow, actions);
    card.appendChild(info);
    return card;
  }
};

function makeTag(text, className) {
  const el = document.createElement('span');
  el.className = `tag ${className}`;
  el.textContent = text;
  return el;
}
