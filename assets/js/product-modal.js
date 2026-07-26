/* =========================================================================
   Modal de produto
   Escolhido em vez de páginas individuais: no GitHub Pages uma rota
   inexistente daria 404 ao atualizar. O estado vai para o hash (#produto=id),
   que sobrevive ao F5 e pode ser compartilhado.
   Acessibilidade: foco preso no diálogo, retorno do foco ao fechar, Esc fecha.
   ========================================================================= */

const ProductModal = {
  root: null,
  dialog: null,
  lastFocused: null,
  current: null,
  selectedSize: '',
  quantity: 1,
  personalization: { enabled: false, name: '', number: '' },
  galleryIndex: 0,

  init() {
    this.root = document.getElementById('productModal');
    if (!this.root) return;
    this.dialog = this.root.querySelector('.modal-dialog');

    this.root.addEventListener('click', (e) => {
      if (e.target === this.root) this.close();
    });
    this.root.querySelector('.modal-close')?.addEventListener('click', () => this.close());
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen()) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'Tab') this.trapFocus(e);
    });

    window.addEventListener('hashchange', () => this.syncFromHash());
    this.syncFromHash();
  },

  isOpen() { return this.root && this.root.classList.contains('open'); },

  syncFromHash() {
    const match = /^#produto=(.+)$/.exec(window.location.hash);
    if (match) {
      const id = decodeURIComponent(match[1]);
      if (findProduct(id)) {
        if (!this.isOpen() || (this.current && this.current.id !== id)) this.open(id, true);
        return;
      }
    }
    if (this.isOpen()) this.close(true);
  },

  open(productId, fromHash) {
    const product = findProduct(productId);
    if (!product || !this.root) return;

    this.lastFocused = document.activeElement;
    this.current = product;
    this.selectedSize = '';
    this.quantity = 1;
    this.galleryIndex = 0;
    this.personalization = { enabled: false, name: '', number: '' };

    this.renderContent(product);
    this.root.classList.add('open');
    this.root.setAttribute('aria-hidden', 'false');
    document.getElementById('overlay').classList.add('open');
    document.body.classList.add('no-scroll');

    if (!fromHash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#produto=${encodeURIComponent(product.id)}`);
    }
    const close = this.root.querySelector('.modal-close');
    if (close) close.focus();
  },

  close(fromHash) {
    if (!this.root) return;
    this.root.classList.remove('open');
    this.root.setAttribute('aria-hidden', 'true');
    if (!Drawer.isOpen()) {
      document.getElementById('overlay').classList.remove('open');
      document.body.classList.remove('no-scroll');
    }
    this.current = null;
    if (!fromHash && window.location.hash.startsWith('#produto=')) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }
    if (this.lastFocused && typeof this.lastFocused.focus === 'function') this.lastFocused.focus();
  },

  trapFocus(event) {
    const focusables = this.dialog.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  },

  /* ---------------------------------------------------------------- render */
  renderContent(product) {
    const grid = this.root.querySelector('.modal-grid');
    const related = this.root.querySelector('.related-grid');
    grid.replaceChildren();
    related.replaceChildren();

    grid.appendChild(this.buildGallery(product));
    grid.appendChild(this.buildBody(product));
    this.buildRelated(product, related);
  },

  buildGallery(product) {
    const wrap = document.createElement('div');
    wrap.className = 'gallery';

    const main = document.createElement('div');
    main.className = 'gallery-main';
    const img = document.createElement('img');
    img.width = 600; img.height = 600; img.decoding = 'async';
    const setImage = (index) => {
      this.galleryIndex = index;
      const view = product.images[index];
      img.src = product.imagesPending ? product.placeholder : view.src;
      img.alt = `Camisa ${product.team} ${product.model} ${product.season} — ${view.alt}`;
      wrap.querySelectorAll('.thumbs button').forEach((b, i) => b.setAttribute('aria-current', String(i === index)));
    };
    main.appendChild(img);
    main.addEventListener('click', () => main.classList.toggle('zoomed'));
    main.title = 'Clique para ampliar';

    const thumbs = document.createElement('div');
    thumbs.className = 'thumbs';
    product.images.forEach((view, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-label', `Ver ${view.alt}`);
      const t = document.createElement('img');
      t.src = product.imagesPending ? product.placeholder : view.src;
      t.alt = '';
      t.width = 62; t.height = 62; t.loading = 'lazy'; t.decoding = 'async';
      btn.appendChild(t);
      btn.addEventListener('click', () => { main.classList.remove('zoomed'); setImage(i); });
      thumbs.appendChild(btn);
    });

    wrap.append(main, thumbs);
    setImage(0);

    if (product.imagesPending) {
      const note = document.createElement('p');
      note.className = 'product-meta';
      note.textContent = 'Imagem ilustrativa. As fotos reais do produto serão publicadas em breve.';
      wrap.appendChild(note);
    }
    return wrap;
  },

  buildBody(product) {
    const body = document.createElement('div');
    body.className = 'modal-body';

    const cat = document.createElement('span');
    cat.className = 'product-category';
    cat.textContent = `${product.category} · ${product.subcategory}`;

    const title = document.createElement('h2');
    title.id = 'productModalTitle';
    title.textContent = `${product.team} ${product.season}`;

    const meta = document.createElement('p');
    meta.className = 'product-meta';
    meta.textContent = `${product.model} · Versão ${product.version} · Código ${product.sku}`;

    const price = document.createElement('div');
    price.className = 'modal-price';
    price.textContent = formatPrice(product.priceReference);

    const priceNote = document.createElement('p');
    priceNote.className = 'product-meta';
    priceNote.textContent = `${BUSINESS_CONFIG.priceNotice} Leve 2 por ${formatPrice(270)} ou 3 por ${formatPrice(380)}.`;

    body.append(cat, title, meta, price, priceNote, this.buildTrustBadges());

    /* Tamanhos */
    const sizeTitle = document.createElement('h3');
    sizeTitle.className = 'product-category';
    sizeTitle.textContent = 'Tamanhos disponíveis';

    const sizeList = document.createElement('div');
    sizeList.className = 'size-list';
    sizeList.setAttribute('role', 'group');
    sizeList.setAttribute('aria-label', 'Selecione o tamanho');

    SIZE_ORDER.forEach((size) => {
      const info = product.sizes[size];
      if (!info) return;
      const status = SIZE_STATUS[info.status];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `size-option ${status.className}`;
      btn.setAttribute('aria-pressed', 'false');
      const label = document.createElement('span');
      label.textContent = size;
      const sub = document.createElement('small');
      sub.textContent = SHOW_STOCK_QUANTITY && info.status === 'low_stock' && info.quantity
        ? `${info.quantity} un.`
        : status.short;
      btn.append(label, sub);
      btn.setAttribute('aria-label', `Tamanho ${size} — ${status.label}`);
      if (!status.selectable) {
        btn.disabled = true;
      } else {
        btn.addEventListener('click', () => {
          this.selectedSize = size;
          sizeList.querySelectorAll('.size-option').forEach((b) => b.setAttribute('aria-pressed', 'false'));
          btn.setAttribute('aria-pressed', 'true');
          sizeHint.textContent = info.status === 'pre_order'
            ? 'Sob encomenda: prazo médio de 5 a 10 dias, confirmado no atendimento.'
            : status.label;
          addBtn.disabled = false;
        });
      }
      sizeList.appendChild(btn);
    });

    const sizeHint = document.createElement('p');
    sizeHint.className = 'product-meta';
    sizeHint.setAttribute('role', 'status');
    sizeHint.textContent = 'Selecione um tamanho para continuar.';

    const legend = document.createElement('div');
    legend.className = 'size-legend';
    [['Disponível', 'var(--neon)'], ['Últimas unidades', 'var(--warn)'], ['Sob encomenda', 'var(--info)'], ['Indisponível', 'var(--gray-dim)']]
      .forEach(([text, color]) => {
        const s = document.createElement('span');
        const i = document.createElement('i');
        i.style.background = color;
        s.append(i, document.createTextNode(text));
        legend.appendChild(s);
      });

    body.append(sizeTitle, sizeList, sizeHint, legend);

    /* Quantidade */
    const qtyWrap = document.createElement('div');
    qtyWrap.className = 'field';
    const qtyLabel = document.createElement('label');
    qtyLabel.textContent = 'Quantidade';
    qtyLabel.setAttribute('for', 'modalQty');
    const qty = document.createElement('div');
    qty.className = 'qty';
    const minus = document.createElement('button');
    minus.type = 'button'; minus.textContent = '−'; minus.setAttribute('aria-label', 'Diminuir quantidade');
    const out = document.createElement('output');
    out.id = 'modalQty'; out.textContent = '1';
    const plus = document.createElement('button');
    plus.type = 'button'; plus.textContent = '+'; plus.setAttribute('aria-label', 'Aumentar quantidade');
    minus.addEventListener('click', () => { this.quantity = sanitizeQuantity(this.quantity - 1); out.textContent = String(this.quantity); });
    plus.addEventListener('click', () => { this.quantity = sanitizeQuantity(this.quantity + 1); out.textContent = String(this.quantity); });
    qty.append(minus, out, plus);
    qtyWrap.append(qtyLabel, qty);
    body.appendChild(qtyWrap);

    /* Personalização */
    if (product.personalizationAvailable) {
      const box = document.createElement('div');
      box.className = 'perso-box';

      const toggleLabel = document.createElement('label');
      toggleLabel.className = 'check';
      const toggle = document.createElement('input');
      toggle.type = 'checkbox';
      toggle.id = 'persoToggle';
      toggleLabel.append(toggle, document.createTextNode('Quero personalizar com nome e número'));

      const fields = document.createElement('div');
      fields.className = 'perso-fields';
      fields.hidden = true;

      const nameField = document.createElement('div');
      nameField.className = 'field';
      const nameLabel = document.createElement('label');
      nameLabel.setAttribute('for', 'persoName');
      nameLabel.textContent = `Nome (até ${LIMITS.personalizationName} caracteres)`;
      const nameInput = document.createElement('input');
      nameInput.className = 'input'; nameInput.id = 'persoName'; nameInput.type = 'text';
      nameInput.maxLength = LIMITS.personalizationName; nameInput.autocomplete = 'off';
      nameField.append(nameLabel, nameInput);

      const numField = document.createElement('div');
      numField.className = 'field';
      const numLabel = document.createElement('label');
      numLabel.setAttribute('for', 'persoNumber');
      numLabel.textContent = 'Número (0 a 99)';
      const numInput = document.createElement('input');
      numInput.className = 'input'; numInput.id = 'persoNumber'; numInput.type = 'text';
      numInput.inputMode = 'numeric'; numInput.maxLength = 2; numInput.autocomplete = 'off';
      numField.append(numLabel, numInput);

      const persoError = document.createElement('p');
      persoError.className = 'field-error';
      persoError.hidden = true;

      const persoNote = document.createElement('p');
      persoNote.className = 'product-meta';
      persoNote.textContent = BUSINESS_CONFIG.personalizationNotice;

      toggle.addEventListener('change', () => {
        fields.hidden = !toggle.checked;
        this.personalization.enabled = toggle.checked;
        if (!toggle.checked) { persoError.hidden = true; nameInput.setAttribute('aria-invalid', 'false'); }
      });
      nameInput.addEventListener('input', () => { this.personalization.name = sanitizePersonalizationName(nameInput.value); });
      numInput.addEventListener('input', () => { this.personalization.number = sanitizePersonalizationNumber(numInput.value); });

      fields.append(nameField, numField);
      box.append(toggleLabel, fields, persoError, persoNote);
      body.appendChild(box);
      this._persoError = persoError;
      this._persoInputs = { nameInput, numInput };
    }

    /* Ações */
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'btn btn-primary btn-block';
    addBtn.textContent = 'Adicionar ao orçamento';
    addBtn.disabled = true; // tamanho obrigatório
    addBtn.addEventListener('click', () => this.addToCart());

    const waBtn = document.createElement('button');
    waBtn.type = 'button';
    waBtn.className = 'btn btn-wa btn-block';
    waBtn.append(icon('whatsapp'), document.createTextNode('Consultar no WhatsApp'));
    waBtn.addEventListener('click', () => {
      openWhatsApp(buildProductMessage(product, {
        size: this.selectedSize,
        quantity: this.quantity,
        personalization: this.personalization
      }));
    });

    const share = document.createElement('div');
    share.className = 'share-row';
    const shareBtn = document.createElement('button');
    shareBtn.type = 'button';
    shareBtn.className = 'btn btn-outline btn-sm';
    shareBtn.textContent = 'Compartilhar';
    shareBtn.addEventListener('click', () => this.share(product));
    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'btn btn-outline btn-sm';
    copyBtn.textContent = 'Copiar link';
    copyBtn.addEventListener('click', () => this.copyLink(product));
    share.append(shareBtn, copyBtn);

    body.append(addBtn, waBtn, share);

    /* Abas: descrição, detalhes, cuidados */
    body.appendChild(this.buildTabs(product));
    return body;
  },

  /**
   * Selos de confiança. Propositalmente reescritos para dizer só o que já é
   * verdade hoje — nada de "satisfação garantida" ou "primeira troca grátis"
   * sem essas políticas estarem formalmente definidas.
   */
  buildTrustBadges() {
    const wrap = document.createElement('div');
    wrap.className = 'trust-badges';
    const items = [
      { icon: 'chat', text: 'Atendimento direto pelo WhatsApp' },
      { icon: 'card', text: 'Pagamento combinado com você' },
      { icon: 'exchange', text: 'Consulte nossa política de troca', href: 'trocas-e-devolucoes.html' }
    ];
    items.forEach((item) => {
      const el = document.createElement(item.href ? 'a' : 'div');
      el.className = 'trust-badge';
      if (item.href) el.href = item.href;
      el.append(icon(item.icon), document.createElement('span'));
      el.querySelector('span').textContent = item.text;
      wrap.appendChild(el);
    });
    return wrap;
  },

  buildTabs(product) {
    const wrap = document.createElement('div');
    const tabs = document.createElement('div');
    tabs.className = 'tabs';
    tabs.setAttribute('role', 'tablist');

    const panels = document.createElement('div');

    const data = [
      { id: 'desc', label: 'Descrição', build: () => {
        const p = document.createElement('p');
        p.textContent = product.description;
        return p;
      } },
      { id: 'det', label: 'Detalhes', build: () => {
        const dl = document.createElement('dl');
        dl.className = 'spec-list';
        [
          ['Código', product.sku], ['Time', product.team], ['Temporada', product.season],
          ['Modelo', product.model], ['Categoria', product.category], ['Versão', product.version],
          ['Personalização', product.personalizationAvailable ? 'Disponível' : 'Não disponível'],
          ['Entrega', product.deliveryEstimate]
        ].forEach(([k, v]) => {
          const row = document.createElement('div');
          const dt = document.createElement('dt'); dt.textContent = k;
          const dd = document.createElement('dd'); dd.textContent = v;
          row.append(dt, dd);
          dl.appendChild(row);
        });
        return dl;
      } },
      { id: 'cuid', label: 'Cuidados', build: () => {
        const ul = document.createElement('ul');
        product.careInstructions.forEach((line) => {
          const li = document.createElement('li');
          li.textContent = line;
          ul.appendChild(li);
        });
        const note = document.createElement('p');
        note.textContent = 'As instruções podem variar conforme o produto. Confira sempre a etiqueta.';
        const box = document.createElement('div');
        box.append(ul, note);
        return box;
      } }
    ];

    data.forEach((tab, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.id = `tab-${tab.id}`;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(i === 0));
      btn.setAttribute('aria-controls', `panel-${tab.id}`);
      btn.textContent = tab.label;

      const panel = document.createElement('div');
      panel.className = 'tab-panel';
      panel.id = `panel-${tab.id}`;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', `tab-${tab.id}`);
      panel.hidden = i !== 0;
      panel.appendChild(tab.build());

      btn.addEventListener('click', () => {
        tabs.querySelectorAll('button').forEach((b) => b.setAttribute('aria-selected', 'false'));
        panels.querySelectorAll('.tab-panel').forEach((p) => { p.hidden = true; });
        btn.setAttribute('aria-selected', 'true');
        panel.hidden = false;
      });

      tabs.appendChild(btn);
      panels.appendChild(panel);
    });

    wrap.append(tabs, panels);
    return wrap;
  },

  buildRelated(product, container) {
    const related = PRODUCTS
      .filter((p) => p.id !== product.id && (p.category === product.category || p.team === product.team))
      .slice(0, 4);
    if (!related.length) return;

    const title = document.createElement('h3');
    title.className = 'product-category';
    title.style.gridColumn = '1 / -1';
    title.textContent = 'Produtos relacionados';
    container.appendChild(title);

    related.forEach((item) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'related-card';
      const img = document.createElement('img');
      img.src = item.imagesPending ? item.placeholder : item.images[0].src;
      img.alt = `Camisa ${item.team} ${item.model} ${item.season}`;
      img.width = 300; img.height = 300; img.loading = 'lazy'; img.decoding = 'async';
      const span = document.createElement('span');
      span.textContent = `${item.team} ${item.season}`;
      btn.append(img, span);
      btn.addEventListener('click', () => this.open(item.id));
      container.appendChild(btn);
    });
  },

  addToCart() {
    if (!this.current) return;
    if (!this.selectedSize) {
      showToast('Selecione um tamanho antes de adicionar ao orçamento.', 'warn');
      return;
    }
    if (this.personalization.enabled) {
      const check = validatePersonalization(this.personalization.name, this.personalization.number);
      if (!check.valid) {
        if (this._persoError) {
          this._persoError.textContent = check.error;
          this._persoError.hidden = false;
        }
        if (this._persoInputs) this._persoInputs.nameInput.setAttribute('aria-invalid', 'true');
        showToast(check.error, 'warn');
        return;
      }
      this.personalization = { enabled: true, name: check.data.name, number: check.data.number };
      if (this._persoError) this._persoError.hidden = true;
    }

    const result = Cart.add(this.current.id, this.selectedSize, this.quantity, this.personalization);
    showToast(result.message, result.ok ? 'success' : 'error');
    if (result.ok) {
      this.close();
      Drawer.open();
    }
  },

  productUrl(product) {
    const base = `${window.location.origin}${window.location.pathname}`;
    return `${base}#produto=${encodeURIComponent(product.id)}`;
  },

  async share(product) {
    const url = this.productUrl(product);
    const text = `${product.team} — ${product.model} ${product.season} na ${BUSINESS_CONFIG.brandName}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text, url });
        return;
      } catch (_) {
        return; // usuário cancelou
      }
    }
    // Fallback: WhatsApp
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, '_blank', 'noopener,noreferrer');
  },

  async copyLink(product) {
    const url = this.productUrl(product);
    try {
      await navigator.clipboard.writeText(url);
      showToast('Link copiado.');
    } catch (_) {
      const area = document.createElement('textarea');
      area.value = url;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      try { document.execCommand('copy'); showToast('Link copiado.'); }
      catch (__) { showToast('Não foi possível copiar o link.', 'error'); }
      document.body.removeChild(area);
    }
  }
};
