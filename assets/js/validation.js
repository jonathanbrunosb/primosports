/* =========================================================================
   Validação e sanitização de entradas
   Tudo que o usuário digita passa por aqui antes de virar mensagem de
   WhatsApp. Nada de innerHTML com texto do usuário — sempre textContent.
   ========================================================================= */

const LIMITS = {
  personalizationName: 14, // limite usual de aplicação em camisa
  personalizationNumber: 2,
  customerName: 60,
  city: 60,
  neighborhood: 60,
  notes: 300,
  quantityMax: 20
};

/** Remove controles, colapsa espaços e corta no tamanho máximo. */
function sanitizeText(value, maxLength) {
  return String(value == null ? '' : value)
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength || 200);
}

/** Nome de personalização: letras, números, espaço, ponto e hífen. */
function sanitizePersonalizationName(value) {
  return sanitizeText(value, LIMITS.personalizationName)
    .replace(/[^0-9A-Za-zÀ-ÿ .'-]/g, '')
    .toUpperCase();
}

/** Número de personalização: 0 a 99, apenas dígitos. */
function sanitizePersonalizationNumber(value) {
  const digits = String(value == null ? '' : value).replace(/\D/g, '').slice(0, LIMITS.personalizationNumber);
  if (digits === '') return '';
  const n = parseInt(digits, 10);
  if (Number.isNaN(n) || n < 0 || n > 99) return '';
  return String(n);
}

/** Quantidade inteira dentro de um intervalo seguro. */
function sanitizeQuantity(value) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(n, LIMITS.quantityMax);
}

/**
 * Valida os campos opcionais do formulário de consulta.
 * @returns {{valid: boolean, errors: Object, data: Object}}
 */
function validateInquiryForm(raw) {
  const errors = {};
  const data = {
    customerName: sanitizeText(raw.customerName, LIMITS.customerName),
    city: sanitizeText(raw.city, LIMITS.city),
    state: sanitizeText(raw.state, 2).toUpperCase(),
    neighborhood: sanitizeText(raw.neighborhood, LIMITS.neighborhood),
    payment: sanitizeText(raw.payment, 40),
    notes: sanitizeText(raw.notes, LIMITS.notes)
  };

  if (data.customerName && data.customerName.length < 2) {
    errors.customerName = 'Informe pelo menos 2 caracteres.';
  }
  if (data.state && !/^[A-Z]{2}$/.test(data.state)) {
    errors.state = 'Use a sigla do estado, por exemplo PE ou AL.';
  }
  if (data.payment && !BUSINESS_CONFIG.paymentMethods.includes(data.payment)) {
    errors.payment = 'Selecione uma forma de pagamento da lista.';
  }

  return { valid: Object.keys(errors).length === 0, errors, data };
}

/** Personalização válida exige ao menos nome ou número. */
function validatePersonalization(name, number) {
  const clean = {
    name: sanitizePersonalizationName(name),
    number: sanitizePersonalizationNumber(number)
  };
  if (!clean.name && !clean.number) {
    return { valid: false, error: 'Informe o nome ou o número da personalização.', data: clean };
  }
  return { valid: true, error: '', data: clean };
}
