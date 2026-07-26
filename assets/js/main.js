/* =========================================================================
   Primo's Sports — inicialização e componentes globais
   ========================================================================= */

/* ------------------------------------------------------------------ Ícones */
const ICON_PATHS = {
  whatsapp: 'M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.41-.56-.42h-.47c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.03s.87 2.35.99 2.51c.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z',
  cart: 'M7 4h-2l-1 2H2v2h2l3.6 7.59-1.35 2.44A2 2 0 0 0 8 21h11v-2H8.42a.25.25 0 0 1-.22-.37L9.1 17h7.45a2 2 0 0 0 1.8-1.11l3.58-7.15A1 1 0 0 0 21 7H7.87l-.62-1.34A1 1 0 0 0 6.34 5H7Zm0 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  heart: 'M12 21s-7.5-4.6-9.6-8.4A5.6 5.6 0 0 1 12 6.1a5.6 5.6 0 0 1 9.6 6.5C19.5 16.4 12 21 12 21Z',
  search: 'M10.5 3a7.5 7.5 0 1 0 4.6 13.4l4.2 4.2 1.5-1.5-4.2-4.2A7.5 7.5 0 0 0 10.5 3Zm0 2a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z',
  menu: 'M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z',
  instagram: 'M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.25 2.2.41.6.23 1 .5 1.4.9.4.4.7.8.9 1.4.17.4.36 1 .42 2.2.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.25 1.8-.42 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.17-1 .36-2.2.42-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-1.8-.25-2.2-.42-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.16-.4-.35-1-.41-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.2.25-1.8.41-2.2.23-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.16 1-.35 2.2-.41C8.4 2.2 8.8 2.2 12 2.2Zm0 4.7a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2Zm0 8.4a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6Zm6.5-8.6a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z',
  shield: 'M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z',
  card: 'M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2H2V6Zm0 4h20v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8Zm3 5h6v2H5v-2Z',
  truck: 'M3 5h11v9H3V5Zm12 3h3.5L21 11v3h-6V8ZM6.5 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm11 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  clock: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 5h-2v6l5 3 1-1.7-4-2.3V7Z',
  box: 'M12 2 3 6.5v11L12 22l9-4.5v-11L12 2Zm0 2.2 6.4 3.2L12 10.6 5.6 7.4 12 4.2Z',
  chat: 'M4 3h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2Z',
  exchange: 'M7 3 3 7l4 4V8h9V6H7V3Zm10 6-4 4v3H4v2h9v3l4-4-4-4Z',
  bolt: 'M13 2 3 14h6l-2 8 10-12h-6l2-8Z'
};

/** Cria um <svg> a partir do catálogo de ícones. */
function icon(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'currentColor');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', ICON_PATHS[name] || ICON_PATHS.shield);
  svg.appendChild(path);
  return svg;
}

/* ------------------------------------------------------------------ Toasts */
function showToast(message, type) {
  const stack = document.getElementById('toastStack');
  if (!stack) return;
  const toast = document.createElement('div');
  toast.className = `toast${type && type !== 'success' ? ` ${type}` : ''}`;
  toast.setAttribute('role', 'status');
  toast.textContent = message; // textContent: nunca innerHTML com texto dinâmico
  stack.appendChild(toast);
  setTimeout(() => toast.remove(), 4200);
}

/* ------------------------------------------------------ Drawer do orçamento */
const Drawer = {
  el: null,
  overlay: null,
  lastFocused: null,

  init() {
    this.el = document.getElementById('cartDrawer');
    this.overlay = document.getElementById('overlay');
    if (!this.el) return;

    document.getElementById('cartBtn')?.addEventListener('click', () => this.open());
    document.getElementById('closeCart')?.addEventListener('click', () => this.close());
    this.overlay?.addEventListener('click', () => {
      if (ProductModal.isOpen()) ProductModal.close();
      this.close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) this.close();
    });

    document.getElementById('clearCart')?.addEventListener('click', () => {
      if (!Cart.items.length) return;
      Cart.clear();
      showToast('Orçamento esvaziado.');
    });

    document.getElementById('sendCart')?.addEventListener('click', () => this.send());

    document.addEventListener('cart:change', () => this.render());
    this.render();
  },

  isOpen() { return this.el && this.el.classList.contains('open'); },

  open() {
    if (!this.el) return;
    this.lastFocused = document.activeElement;
    this.el.classList.add('open');
    this.el.setAttribute('aria-hidden', 'false');
    this.overlay.classList.add('open');
    document.body.classList.add('no-scroll');
    document.getElementById('closeCart')?.focus();
  },

  close() {
    if (!this.el) return;
    this.el.classList.remove('open');
    this.el.setAttribute('aria-hidden', 'true');
    if (!ProductModal.isOpen()) {
      this.overlay.classList.remove('open');
      document.body.classList.remove('no-scroll');
    }
    if (this.lastFocused && typeof this.lastFocused.focus === 'function') this.lastFocused.focus();
  },

  render() {
    const body = document.getElementById('cartItems');
    const summaryEl = document.getElementById('cartSummary');
    const countEl = document.getElementById('cartCount');
    if (!body) return;

    const items = Cart.detailed();
    const summary = Cart.summary();

    if (countEl) {
      countEl.textContent = String(summary.totalQuantity);
      countEl.hidden = summary.totalQuantity === 0;
    }

    body.replaceChildren();

    if (!items.length) {
      const box = document.createElement('div');
      box.className = 'state-box';
      const h = document.createElement('h3');
      h.textContent = 'Seu orçamento está vazio';
      const p = document.createElement('p');
      p.textContent = 'Escolha uma camisa, selecione o tamanho e adicione aqui. Depois é só enviar a consulta pelo WhatsApp.';
      box.append(h, p);
      body.appendChild(box);
    } else {
      items.forEach((item) => body.appendChild(this.buildItem(item)));
    }

    if (summaryEl) this.renderSummary(summaryEl, summary);

    const send = document.getElementById('sendCart');
    if (send) send.disabled = summary.isEmpty;
  },

  buildItem(item) {
    const row = document.createElement('div');
    row.className = 'cart-item';

    const img = document.createElement('img');
    img.className = 'thumb';
    img.src = item.image;
    img.alt = `Camisa ${item.team} ${item.model} ${item.season}`;
    img.width = 64; img.height = 64; img.loading = 'lazy'; img.decoding = 'async';

    const info = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = `${item.team} ${item.season}`;
    const meta = document.createElement('p');
    meta.className = 'meta';
    meta.textContent = `${item.model} · ${item.version} · ${item.sku}`;

    /* Troca de tamanho direto no carrinho */
    const sizeSelect = document.createElement('select');
    sizeSelect.className = 'input';
    sizeSelect.style.minHeight = '38px';
    sizeSelect.setAttribute('aria-label', `Tamanho de ${item.team}`);
    const product = findProduct(item.productId);
    SIZE_ORDER.forEach((size) => {
      const info2 = product.sizes[size];
      if (!info2) return;
      const opt = document.createElement('option');
      opt.value = size;
      opt.textContent = `${size} — ${SIZE_STATUS[info2.status].label}`;
      opt.disabled = !SIZE_STATUS[info2.status].selectable;
      opt.selected = size === item.size;
      sizeSelect.appendChild(opt);
    });
    sizeSelect.addEventListener('change', () => {
      const result = Cart.updateSize(item.index, sizeSelect.value);
      if (!result.ok) showToast(result.message, 'warn');
    });

    const status = document.createElement('p');
    status.className = 'meta';
    status.textContent = item.sizeStatus === 'pre_order' ? 'Sob encomenda: 5 a 10 dias (a confirmar)' : SIZE_STATUS[item.sizeStatus].label;

    info.append(title, meta, sizeSelect, status);

    if (item.personalization.enabled) {
      const perso = document.createElement('p');
      perso.className = 'perso';
      perso.textContent = `Personalização: ${describePersonalization(item.personalization)}`;
      info.appendChild(perso);
    }

    const actions = document.createElement('div');
    actions.className = 'cart-item-actions';

    const qty = document.createElement('div');
    qty.className = 'qty';
    const minus = document.createElement('button');
    minus.type = 'button'; minus.textContent = '−';
    minus.setAttribute('aria-label', `Diminuir quantidade de ${item.team}`);
    const value = document.createElement('span');
    value.textContent = String(item.quantity);
    const plus = document.createElement('button');
    plus.type = 'button'; plus.textContent = '+';
    plus.setAttribute('aria-label', `Aumentar quantidade de ${item.team}`);
    minus.addEventListener('click', () => Cart.updateQuantity(item.index, item.quantity - 1));
    plus.addEventListener('click', () => Cart.updateQuantity(item.index, item.quantity + 1));
    qty.append(minus, value, plus);

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'link-danger';
    remove.textContent = 'Remover';
    remove.setAttribute('aria-label', `Remover ${item.team} do orçamento`);
    remove.addEventListener('click', () => {
      Cart.remove(item.index);
      showToast('Item removido do orçamento.');
    });

    actions.append(qty, remove);
    info.appendChild(actions);
    row.append(img, info);
    return row;
  },

  renderSummary(el, summary) {
    el.replaceChildren();
    if (summary.isEmpty) return;

    const line = (label, value, className) => {
      const div = document.createElement('div');
      if (className) div.className = className;
      const a = document.createElement('span'); a.textContent = label;
      const b = document.createElement('span'); b.textContent = value;
      div.append(a, b);
      return div;
    };

    el.appendChild(line('Quantidade total', `${summary.totalQuantity} ${summary.totalQuantity === 1 ? 'camisa' : 'camisas'}`));

    if (summary.requiresQuote) {
      // 4+ camisas: regra não definida comercialmente. Nada de valor estimado.
      el.appendChild(line('Pacote', BUSINESS_CONFIG.pricing.bulkQuoteLabel));
      const note = document.createElement('p');
      note.className = 'product-meta';
      note.textContent = BUSINESS_CONFIG.pricing.bulkQuoteMessage;
      el.appendChild(note);
    } else {
      if (summary.savings > 0) el.appendChild(line('Economia estimada', formatPrice(summary.savings), 'save'));
      el.appendChild(line('Valor estimado', formatPrice(summary.total), 'total'));
      const note = document.createElement('p');
      note.className = 'product-meta';
      note.textContent = BUSINESS_CONFIG.priceNotice;
      el.appendChild(note);
    }

    const incentive = this.incentiveMessage(summary);
    if (incentive) {
      const box = document.createElement('p');
      box.className = 'cart-incentive';
      box.textContent = incentive;
      el.appendChild(box);
    }
  },

  /** Empurrão contextual para o próximo degrau de economia, sem inventar nada. */
  incentiveMessage(summary) {
    const packages = BUSINESS_CONFIG.pricing.packages;
    const next = packages.find((p) => p.quantity === summary.totalQuantity + 1);
    if (next) {
      return `Adicione mais 1 camisa e leve ${next.quantity} por ${formatPrice(next.total)}.`;
    }
    if (summary.totalQuantity === packages[packages.length - 1].quantity) {
      return 'Você atingiu a melhor condição disponível no site.';
    }
    if (summary.requiresQuote) {
      return 'Solicite uma condição especial pelo WhatsApp.';
    }
    return '';
  },

  send() {
    const items = Cart.detailed();
    if (!items.length) {
      showToast('Adicione ao menos uma camisa ao orçamento.', 'warn');
      return;
    }

    const form = document.getElementById('inquiryForm');
    let inquiry = {};
    if (form) {
      const raw = {
        customerName: form.customerName.value,
        city: form.city.value,
        state: form.state.value,
        neighborhood: form.neighborhood.value,
        payment: form.payment.value,
        notes: form.notes.value
      };
      const check = validateInquiryForm(raw);
      // Limpa erros anteriores
      form.querySelectorAll('.field-error').forEach((e) => { e.hidden = true; e.textContent = ''; });
      form.querySelectorAll('.input').forEach((i) => i.setAttribute('aria-invalid', 'false'));

      if (!check.valid) {
        Object.entries(check.errors).forEach(([field, message]) => {
          const input = form.elements[field];
          const error = form.querySelector(`[data-error-for="${field}"]`);
          if (input) input.setAttribute('aria-invalid', 'true');
          if (error) { error.textContent = message; error.hidden = false; }
        });
        showToast('Revise os campos destacados antes de enviar.', 'warn');
        return;
      }
      inquiry = check.data;
    }

    openWhatsApp(buildCartMessage(items, Cart.summary(), inquiry));
  }
};

/* -------------------------------------------------- Carrossel de destaques */
function initDestaquesCarousel() {
  const grid = document.getElementById('productGrid');
  if (!grid || !grid.classList.contains('carousel-grid')) return;

  const prev = document.getElementById('destaquesPrev');
  const next = document.getElementById('destaquesNext');
  const dotsEl = document.getElementById('destaquesDots');
  const cards = Array.from(grid.children);
  if (!cards.length) return;

  const cardWidth = () => cards[0].getBoundingClientRect().width + 20; // + gap aproximado

  const updateArrows = () => {
    const max = grid.scrollWidth - grid.clientWidth - 4;
    if (prev) prev.disabled = grid.scrollLeft <= 4;
    if (next) next.disabled = grid.scrollLeft >= max;
    if (dotsEl) {
      const index = Math.round(grid.scrollLeft / cardWidth());
      dotsEl.querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-current', String(i === index)));
    }
  };

  prev?.addEventListener('click', () => grid.scrollBy({ left: -cardWidth(), behavior: 'smooth' }));
  next?.addEventListener('click', () => grid.scrollBy({ left: cardWidth(), behavior: 'smooth' }));

  let ticking = false;
  grid.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { updateArrows(); ticking = false; });
  });

  if (dotsEl) {
    dotsEl.replaceChildren();
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Ir para camisa ${i + 1}`);
      dot.addEventListener('click', () => grid.scrollTo({ left: cardWidth() * i, behavior: 'smooth' }));
      dotsEl.appendChild(dot);
    });
  }

  updateArrows();
}

/** Dropdown "Categorias" do menu: clique, teclado, Esc e fechar ao clicar fora. */
function initNavDropdowns() {
  const closeAll = (except) => {
    document.querySelectorAll('.nav-dropdown-menu.open').forEach((menu) => {
      if (menu === except) return;
      menu.classList.remove('open');
      const btn = menu.previousElementSibling;
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  };

  document.querySelectorAll('.nav-dropdown-toggle').forEach((btn) => {
    const menu = document.getElementById(btn.getAttribute('aria-controls'));
    if (!menu) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !menu.classList.contains('open');
      closeAll(willOpen ? menu : null);
      menu.classList.toggle('open', willOpen);
      btn.setAttribute('aria-expanded', String(willOpen));
    });
  });

  document.addEventListener('click', () => closeAll());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });
}

/* --------------------------------------------------------------- Cabeçalho */
function initHeader() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.appendChild(icon('menu'));
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('no-scroll', open);
    });
    // Fecha ao escolher uma opção e libera o scroll
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
        toggle.focus();
      }
    });
  }

  initNavDropdowns();

  document.getElementById('cartBtn')?.prepend(icon('cart'));
  document.getElementById('favoritesBtn')?.prepend(icon('heart'));
  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn) {
    searchBtn.appendChild(icon('search'));
    searchBtn.addEventListener('click', () => {
      const input = document.getElementById('searchInput');
      if (input) {
        input.scrollIntoView({ block: 'center' });
        input.focus();
      } else {
        window.location.href = 'catalogo.html';
      }
    });
  }
}

/* ------------------------------------- Conteúdo alimentado pelo config.js */
function applyBusinessConfig() {
  document.querySelectorAll('[data-config]').forEach((el) => {
    const value = BUSINESS_CONFIG[el.dataset.config];
    if (typeof value === 'string' && value) el.textContent = value;
  });

  document.querySelectorAll('[data-config-href]').forEach((el) => {
    const key = el.dataset.configHref;
    if (key === 'instagram') el.href = BUSINESS_CONFIG.instagramUrl;
    if (key === 'email') el.href = `mailto:${BUSINESS_CONFIG.email}`;
    if (key === 'whatsapp') el.href = buildWhatsAppUrl(buildSimpleMessage(el.dataset.message || ''));
  });

  document.querySelectorAll('[data-payment-methods]').forEach((el) => {
    el.replaceChildren();
    BUSINESS_CONFIG.paymentMethods.forEach((method) => {
      const span = document.createElement('span');
      span.append(icon(method === 'Pix' ? 'bolt' : 'card'), document.createElement('b'));
      span.querySelector('b').textContent = method;
      el.appendChild(span);
    });
  });

  // Dados cadastrais só aparecem quando existirem de fato.
  document.querySelectorAll('[data-legal]').forEach((el) => {
    const value = BUSINESS_CONFIG.legal[el.dataset.legal];
    if (value) el.textContent = value;
    else el.hidden = true;
  });

  const year = document.getElementById('currentYear');
  if (year) year.textContent = String(new Date().getFullYear());
}

/** Links de WhatsApp declarativos: <a class="whatsapp-link" data-message="..."> */
function initWhatsAppLinks() {
  document.querySelectorAll('.whatsapp-link').forEach((el) => {
    const message = buildSimpleMessage(el.dataset.message || '');
    if (el.tagName === 'A') {
      el.href = buildWhatsAppUrl(message);
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    } else {
      el.addEventListener('click', () => openWhatsApp(message));
    }
  });

  document.querySelectorAll('.price-buy').forEach((btn) => {
    btn.addEventListener('click', () => openWhatsApp(buildPackageMessage(btn.dataset.package || '')));
  });

  document.querySelectorAll('.whatsapp-float').forEach((el) => el.appendChild(icon('whatsapp')));
}

/** Ícones dos blocos de benefício, declarados via data-icon. */
function initIcons() {
  document.querySelectorAll('[data-icon]').forEach((el) => {
    if (el.querySelector('svg')) return;
    el.prepend(icon(el.dataset.icon));
  });
}

/* --------------------------------------------------- Animação de entrada */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach((el) => el.classList.add('visible'));
    return;
  }
  // A partir daqui o JS controla a animação, então pode ocultar o estado inicial.
  document.documentElement.classList.add('js');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
    // threshold 0 + margem: dispara assim que qualquer pixel se aproxima da tela,
    // inclusive em blocos mais altos que o viewport.
  }, { threshold: 0, rootMargin: '200px 0px' });
  items.forEach((el) => observer.observe(el));

  /* Rede de segurança: nenhum conteúdo pode ficar invisível por falha de
     animação. Passados alguns segundos, tudo que sobrou é exibido. */
  window.setTimeout(() => {
    items.forEach((el) => el.classList.add('visible'));
    observer.disconnect();
  }, 10000);
}

/* -------------------------------------------------------------- Analytics
   Só carrega quando explicitamente habilitado no config.js E com ID válido.
   Enquanto estiver desligado, nenhum cookie não essencial é criado — por
   isso o site não exibe banner de cookies. Ver README para ativar. */
function initAnalytics() {
  const { enabled, measurementId } = BUSINESS_CONFIG.analytics;
  if (!enabled || !/^G-[A-Z0-9]{6,}$/.test(measurementId)) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', measurementId, { anonymize_ip: true });
}

/* Aviso em desenvolvimento: número de WhatsApp ainda é o fictício. */
function warnPlaceholderNumber() {
  if (BUSINESS_CONFIG.whatsappIsPlaceholder && /localhost|127\.0\.0\.1/.test(window.location.hostname)) {
    console.warn('[Primo\'s Sports] WhatsApp ainda é o número fictício de config.js. Substitua antes de publicar.');
  }
}

/** Badge de favoritos no cabeçalho, igual ao do carrinho. */
function renderFavoritesBadge() {
  const badge = document.getElementById('favoritesCount');
  if (!badge) return;
  const count = Favorites.ids.length;
  badge.textContent = String(count);
  badge.hidden = count === 0;
}

/* ------------------------------------------------------------------- Boot */
document.addEventListener('DOMContentLoaded', () => {
  applyBusinessConfig();
  initHeader();
  initIcons();
  initWhatsAppLinks();
  Favorites.load();
  renderFavoritesBadge();
  document.addEventListener('favorites:change', renderFavoritesBadge);
  document.addEventListener('catalog:rendered', initDestaquesCarousel, { once: true });
  Cart.load();
  Drawer.init();
  ProductModal.init();
  initReveal();
  initAnalytics();
  warnPlaceholderNumber();

  const grid = document.getElementById('productGrid');
  if (grid) {
    Catalog.init({
      limit: Number(grid.dataset.limit || 0),
      sort: grid.dataset.sort || 'featured'
    });
  }
});
