/* =========================================================================
   Mensagens de WhatsApp
   Ponto ÚNICO de montagem das mensagens. O número vem do config.js.
   ========================================================================= */

/** Mensagem curta para links avulsos (hero, footer, botão flutuante). */
function buildSimpleMessage(text) {
  const base = text && text.trim() ? text.trim() : 'Gostaria de mais informações sobre as camisas.';
  return `Olá! Vim pelo site da ${BUSINESS_CONFIG.brandName}.\n\n${base}`;
}

/** Mensagem de consulta de um único produto. */
function buildProductMessage(product, options) {
  const opts = options || {};
  const lines = [
    `Olá! Vim pelo site da ${BUSINESS_CONFIG.brandName} e gostaria de consultar este produto:`,
    '',
    `${product.team} — ${product.model} ${product.season}`,
    `Código: ${product.sku}`,
    `Versão: ${product.version}`
  ];
  if (opts.size) lines.push(`Tamanho: ${opts.size}`);
  if (opts.quantity) lines.push(`Quantidade: ${opts.quantity}`);
  lines.push(`Personalização: ${describePersonalization(opts.personalization)}`);
  lines.push('');
  lines.push('Poderia confirmar a disponibilidade, o prazo de entrega e o valor final?');
  lines.push('');
  lines.push(`Origem: Site ${BUSINESS_CONFIG.brandName}`);
  return lines.join('\n');
}

/** Texto legível da personalização de um item. */
function describePersonalization(perso) {
  if (!perso || !perso.enabled) return 'Não';
  const parts = [];
  if (perso.name) parts.push(`nome ${perso.name}`);
  if (perso.number) parts.push(`número ${perso.number}`);
  if (!parts.length) return 'Sim (a definir no atendimento)';
  return parts.join(', ').replace(/^./, (c) => c.toUpperCase());
}

/**
 * Mensagem completa do carrinho de orçamento.
 * @param {Array} items itens do carrinho
 * @param {Object} summary totais calculados pelo cart.js
 * @param {Object} inquiry dados opcionais do formulário (já validados)
 */
function buildCartMessage(items, summary, inquiry) {
  const info = inquiry || {};
  const lines = [`Olá! Vim pelo site da ${BUSINESS_CONFIG.brandName} e gostaria de consultar este pedido:`, ''];

  items.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.team} — ${item.model} ${item.season}`);
    lines.push(`Código: ${item.sku}`);
    lines.push(`Versão: ${item.version}`);
    lines.push(`Tamanho: ${item.size}${item.sizeStatusLabel ? ` (${item.sizeStatusLabel})` : ''}`);
    lines.push(`Quantidade: ${item.quantity}`);
    lines.push(`Personalização: ${describePersonalization(item.personalization)}`);
    lines.push('');
  });

  lines.push(`Quantidade total: ${summary.totalQuantity} ${summary.totalQuantity === 1 ? 'camisa' : 'camisas'}`);

  if (summary.requiresQuote) {
    lines.push(`Pacote promocional: ${BUSINESS_CONFIG.pricing.bulkQuoteLabel}`);
    lines.push('Valor estimado: a confirmar no atendimento');
  } else {
    lines.push(`Pacote promocional: ${summary.totalQuantity} ${summary.totalQuantity === 1 ? 'camisa' : 'camisas'}`);
    lines.push(`Valor estimado: ${formatPrice(summary.total)}`);
    if (summary.savings > 0) lines.push(`Economia estimada: ${formatPrice(summary.savings)}`);
  }

  const place = [info.neighborhood, info.city, info.state].filter(Boolean).join(' - ');
  if (info.customerName) lines.push('', `Nome: ${info.customerName}`);
  if (place) lines.push(`Entrega: ${place}`);
  if (info.payment) lines.push(`Forma de pagamento pretendida: ${info.payment}`);
  if (info.notes) lines.push(`Observações: ${info.notes}`);

  lines.push('');
  lines.push('Poderia confirmar a disponibilidade, o prazo de entrega e o valor final?');
  lines.push('');
  lines.push(`Origem: Site ${BUSINESS_CONFIG.brandName}`);

  return lines.join('\n');
}

/** Mensagem de interesse num pacote da tabela de preços. */
function buildPackageMessage(packageLabel) {
  return [
    `Olá! Vim pelo site da ${BUSINESS_CONFIG.brandName}.`,
    '',
    `Tenho interesse na condição de ${packageLabel}.`,
    'Poderia me ajudar a escolher os modelos e confirmar a disponibilidade?',
    '',
    `Origem: Site ${BUSINESS_CONFIG.brandName}`
  ].join('\n');
}

/** Abre o WhatsApp em nova aba com a mensagem pronta. */
function openWhatsApp(message) {
  const win = window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  if (!win) {
    // Pop-up bloqueado: avisa em vez de falhar silenciosamente.
    showToast('Não foi possível abrir o WhatsApp. Verifique o bloqueio de pop-ups do navegador.', 'error');
  }
}
