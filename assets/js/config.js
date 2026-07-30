/* =========================================================================
   Primo's Sports — Configuração central
   -------------------------------------------------------------------------
   TODA informação institucional do site sai deste arquivo.
   Alterou aqui, alterou no site inteiro (header, footer, políticas,
   mensagens de WhatsApp e dados estruturados de SEO).

   NÃO copie e cole telefone, e-mail ou textos institucionais em outros
   arquivos. Se precisar de um dado novo, adicione-o aqui primeiro.
   ========================================================================= */

const BUSINESS_CONFIG = {
  brandName: "Primo's Sports",
  slogan: 'Aqui você veste mais que uma camisa. Você veste sua paixão.',
  tagline: 'Vista sua paixão. Jogue com estilo.',

  /* -----------------------------------------------------------------------
     Número oficial do WhatsApp Business.
     Formato: código do país + DDD + número, apenas dígitos.
     Este é o ÚNICO lugar do projeto onde o número deve existir.
     --------------------------------------------------------------------- */
  whatsappNumber: '5581974017011',
  whatsappIsPlaceholder: false,

  instagramHandle: '@primos.sports',
  instagramUrl: 'https://www.instagram.com/primos.sports',
  email: 'primosports2026@gmail.com',

  serviceRegions: ['Pernambuco', 'Alagoas'],
  serviceRegionsText:
    'Atendemos clientes em Pernambuco e Alagoas, com condições especiais de entrega nas regiões metropolitanas de Recife e Maceió.',

  serviceHours: 'Atendimento de domingo a domingo.',

  deliveryMessage:
    'Frete grátis para a Região Metropolitana do Recife e para a Região Metropolitana de Maceió. Para outras cidades, consulte disponibilidade, prazo e valor da entrega.',
  deliveryTime:
    'Produtos disponíveis para pronta entrega ou sob encomenda, com prazo médio de 5 a 10 dias.',
  deliveryTimeNote:
    'O prazo definitivo é confirmado no atendimento, de acordo com o produto, o tamanho e a localidade.',

  /* Formas de pagamento aceitas. NÃO acrescentar parcelamento ou número de
     parcelas enquanto a regra não for definida comercialmente. */
  paymentMethods: ['Pix', 'Cartão de crédito', 'Cartão de débito'],

  /* -----------------------------------------------------------------------
     Tabela de preços (valores de referência, sujeitos a confirmação).
     A regra para 4 ou mais camisas NÃO foi definida: não extrapolar,
     não somar pacotes, não inventar desconto. Ver PRICING_RULES abaixo.
     --------------------------------------------------------------------- */
  pricing: {
    unitPrice: 150,
    packages: [
      { quantity: 1, total: 150, savings: 0, label: '1 camisa', note: 'Valor por unidade' },
      { quantity: 2, total: 270, savings: 30, label: '2 camisas', note: 'Economize R$ 30', highlight: true },
      { quantity: 3, total: 380, savings: 70, label: '3 camisas', note: 'Economize R$ 70' }
    ],
    // PENDENTE: definição comercial para 4 ou mais camisas.
    bulkQuoteLabel: 'Consulte condição especial',
    bulkQuoteMessage:
      'Para 4 camisas ou mais a condição é especial e confirmada no atendimento pelo WhatsApp.'
  },

  personalizationNotice:
    'A personalização está sujeita à disponibilidade e confirmação de valor.',
  // PENDENTE: valor da personalização não definido. Não inserir preço fixo.

  priceNotice:
    'Valores de referência sujeitos a confirmação no atendimento. Estoque sujeito à disponibilidade.',

  /* -----------------------------------------------------------------------
     Dados cadastrais da operação.
     PENDENTE: não preencher com informação fictícia. Enquanto estiverem
     vazios, o site simplesmente não exibe esses campos.
     --------------------------------------------------------------------- */
  legal: {
    companyName: '', // Razão social
    tradeName: '', // Nome empresarial / fantasia
    cnpj: '',
    address: '',
    responsible: '',
    phone: ''
  },

  seo: {
    siteName: "Primo's Sports",
    defaultTitle: "Camisas de Times e Seleções | Primo's Sports",
    defaultDescription:
      'Camisas de clubes brasileiros, internacionais e seleções. Atendimento em Pernambuco e Alagoas, com entrega grátis nas regiões metropolitanas de Recife e Maceió.',
    // Domínio próprio. Exige o arquivo /CNAME (na raiz do repositório) e o DNS
    // do registrador apontando para o GitHub Pages — ver README.
    siteUrl: 'https://primosports.net.br/',
    shareImage: 'assets/images/brand/social-share-primos-sports.jpg',
    locale: 'pt_BR'
  },

  /* Analytics desativado. O script só carrega quando `enabled === true`
     E existir um measurementId válido. Ver README para ativar. */
  analytics: {
    enabled: false,
    measurementId: ''
  },

  social: [
    { name: 'Instagram', url: 'https://www.instagram.com/primos.sports', icon: 'instagram' }
  ]
};

/* Regras de preço isoladas para facilitar teste e evolução futura. */
const PRICING_RULES = {
  /**
   * Preço fechado do pacote para a quantidade informada.
   * @returns {number|null} valor em reais, ou null quando depende de consulta.
   */
  calculatePackagePrice(totalQuantity) {
    const qty = Number(totalQuantity);
    if (!Number.isInteger(qty) || qty < 1) return null;
    const pack = BUSINESS_CONFIG.pricing.packages.find((p) => p.quantity === qty);
    return pack ? pack.total : null; // 4+ => null => consultar
  },

  /** Economia estimada para a quantidade informada. */
  calculateSavings(totalQuantity) {
    const qty = Number(totalQuantity);
    const pack = BUSINESS_CONFIG.pricing.packages.find((p) => p.quantity === qty);
    return pack ? pack.savings : 0;
  },

  /** True quando a quantidade cai na faixa sem regra definida (4+). */
  requiresQuote(totalQuantity) {
    return this.calculatePackagePrice(totalQuantity) === null;
  }
};

const CURRENCY = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

/** Formata um valor em reais. */
function formatPrice(value) {
  return CURRENCY.format(value);
}

/** Link de WhatsApp com mensagem pré-preenchida e codificada. */
function buildWhatsAppUrl(message) {
  const text = encodeURIComponent(String(message || '').trim());
  return `https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${text}`;
}
