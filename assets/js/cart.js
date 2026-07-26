/* =========================================================================
   Carrinho de orçamento
   NÃO é checkout. Nenhum pagamento é processado aqui: o carrinho existe
   para montar uma consulta organizada e enviá-la ao WhatsApp.
   ========================================================================= */

const Cart = {
  items: [],

  load() {
    this.items = readCollection(STORAGE_KEYS.cart)
      .filter((item) => item && findProduct(item.productId) && SIZE_ORDER.includes(item.size))
      .map((item) => ({
        productId: item.productId,
        size: item.size,
        quantity: sanitizeQuantity(item.quantity),
        personalization: normalizePersonalization(item.personalization)
      }));
    return this.items;
  },

  save() {
    const ok = writeCollection(STORAGE_KEYS.cart, this.items);
    if (!ok && HAS_STORAGE === false) {
      // Sem storage o carrinho vive só nesta sessão — informa uma vez.
      Cart._warnedStorage = Cart._warnedStorage || (showToast('Seu navegador não permite salvar o orçamento. Ele valerá apenas nesta visita.', 'warn'), true);
    }
    document.dispatchEvent(new CustomEvent('cart:change'));
    return ok;
  },

  /**
   * Adiciona um item. Tamanho é obrigatório e precisa estar selecionável.
   * @returns {{ok: boolean, message: string, merged?: boolean}}
   */
  add(productId, size, quantity, personalization) {
    const product = findProduct(productId);
    if (!product) return { ok: false, message: 'Produto não encontrado.' };
    if (!size || !SIZE_ORDER.includes(size)) {
      return { ok: false, message: 'Selecione um tamanho antes de adicionar ao orçamento.' };
    }
    const sizeInfo = product.sizes[size];
    if (!sizeInfo || !SIZE_STATUS[sizeInfo.status].selectable) {
      return { ok: false, message: `O tamanho ${size} está indisponível para este modelo.` };
    }

    const qty = sanitizeQuantity(quantity);
    const perso = normalizePersonalization(personalization);
    const existing = this.items.find(
      (item) => item.productId === productId && item.size === size && samePersonalization(item.personalization, perso)
    );

    if (existing) {
      existing.quantity = sanitizeQuantity(existing.quantity + qty);
      this.save();
      return { ok: true, merged: true, message: `Quantidade atualizada: ${product.team} ${size}.` };
    }

    this.items.push({ productId, size, quantity: qty, personalization: perso });
    this.save();
    return { ok: true, message: `${product.team} (${size}) adicionado ao orçamento.` };
  },

  updateQuantity(index, quantity) {
    const item = this.items[index];
    if (!item) return;
    const qty = Math.floor(Number(quantity));
    if (!Number.isFinite(qty) || qty < 1) {
      this.remove(index);
      return;
    }
    item.quantity = sanitizeQuantity(qty);
    this.save();
  },

  updateSize(index, size) {
    const item = this.items[index];
    if (!item) return { ok: false, message: 'Item não encontrado.' };
    const product = findProduct(item.productId);
    const info = product && product.sizes[size];
    if (!info || !SIZE_STATUS[info.status].selectable) {
      return { ok: false, message: `Tamanho ${size} indisponível para este modelo.` };
    }
    item.size = size;
    this.save();
    return { ok: true, message: `Tamanho alterado para ${size}.` };
  },

  remove(index) {
    if (!this.items[index]) return;
    this.items.splice(index, 1);
    this.save();
  },

  clear() {
    this.items = [];
    this.save();
  },

  count() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  /** Itens enriquecidos com os dados do produto, prontos para render/mensagem. */
  detailed() {
    return this.items.map((item, index) => {
      const product = findProduct(item.productId);
      const status = product.sizes[item.size].status;
      return {
        index,
        productId: item.productId,
        sku: product.sku,
        team: product.team,
        model: product.model,
        season: product.season,
        version: product.version,
        image: product.imagesPending ? product.placeholder : product.images[0].src,
        personalizationAvailable: product.personalizationAvailable,
        size: item.size,
        sizeStatus: status,
        sizeStatusLabel: SIZE_STATUS[status].label,
        quantity: item.quantity,
        personalization: item.personalization
      };
    });
  },

  /**
   * Totais do orçamento.
   * Para 4+ camisas não existe regra definida: `requiresQuote` fica true e
   * nenhum valor é estimado. Não extrapolar a promoção.
   */
  summary() {
    const totalQuantity = this.count();
    const total = PRICING_RULES.calculatePackagePrice(totalQuantity);
    return {
      totalQuantity,
      total: total === null ? 0 : total,
      savings: PRICING_RULES.calculateSavings(totalQuantity),
      requiresQuote: totalQuantity > 0 && total === null,
      isEmpty: totalQuantity === 0
    };
  }
};

/** Estrutura estável de personalização. */
function normalizePersonalization(perso) {
  if (!perso || !perso.enabled) return { enabled: false, name: '', number: '' };
  return {
    enabled: true,
    name: sanitizePersonalizationName(perso.name),
    number: sanitizePersonalizationNumber(perso.number)
  };
}

function samePersonalization(a, b) {
  return a.enabled === b.enabled && a.name === b.name && a.number === b.number;
}
