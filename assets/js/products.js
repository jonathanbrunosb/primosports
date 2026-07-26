/* =========================================================================
   Primo's Sports — base de produtos
   -------------------------------------------------------------------------
   ATENÇÃO: produtos, estoques e disponibilidade são DEMONSTRATIVOS.
   Substituir pelas informações reais antes do lançamento comercial.

   Como cadastrar um produto novo: copie um bloco existente, troque os
   campos e mantenha o `id` único (usado na URL do modal e no localStorage).

   Status de tamanho aceitos:
     'available'   → Disponível
     'low_stock'   → Últimas unidades
     'pre_order'   → Sob encomenda (prazo médio de 5 a 10 dias)
     'unavailable' → Indisponível (não selecionável)

   Imagens: enquanto `imagesPending` for true o site usa um placeholder local.
   Ao receber as fotos reais, salve-as nos caminhos listados em `images` e
   troque `imagesPending` para false.
   ========================================================================= */

const SIZE_ORDER = ['P', 'M', 'G', 'GG', 'XG'];

const SIZE_STATUS = {
  available: { label: 'Disponível', short: 'Disp.', className: 'is-available', selectable: true },
  low_stock: { label: 'Últimas unidades', short: 'Últimas', className: 'is-low', selectable: true },
  pre_order: { label: 'Sob encomenda', short: 'Encomenda', className: 'is-preorder', selectable: true },
  unavailable: { label: 'Indisponível', short: 'Esgotado', className: 'is-off', selectable: false }
};

/* Exibir a quantidade exata em tela? Os números atuais são demonstrativos,
   então fica desligado. Ligue apenas quando o estoque for real. */
const SHOW_STOCK_QUANTITY = false;

const DEFAULT_CARE = [
  'Lavar à mão ou em ciclo delicado',
  'Utilizar água fria',
  'Não utilizar alvejante',
  'Não deixar de molho',
  'Não utilizar secadora',
  'Secar à sombra',
  'Não passar diretamente sobre estampas, nomes, números ou escudos',
  'Lavar preferencialmente do avesso'
];

/**
 * Monta a lista de caminhos de imagem esperados para um produto.
 * Os arquivos ainda não existem: são o destino das fotos reais.
 */
function productImagePaths(folder, slug) {
  return [
    { src: `assets/images/products/${folder}/${slug}-frente.webp`, alt: 'frente' },
    { src: `assets/images/products/${folder}/${slug}-costas.webp`, alt: 'costas' },
    { src: `assets/images/products/${folder}/${slug}-escudo.webp`, alt: 'detalhe do escudo' },
    { src: `assets/images/products/${folder}/${slug}-tecido.webp`, alt: 'detalhe do tecido' },
    { src: `assets/images/products/${folder}/${slug}-detalhe.webp`, alt: 'detalhe adicional' }
  ];
}

/** Atalho para declarar os cinco tamanhos sem repetir estrutura. */
function sizes(p, m, g, gg, xg) {
  const build = (v) => (Array.isArray(v) ? { status: v[0], quantity: v[1] } : { status: v, quantity: 0 });
  return {
    P: build(p), M: build(m), G: build(g), GG: build(gg), XG: build(xg)
  };
}

const A = 'available';
const L = 'low_stock';
const E = 'pre_order';
const X = 'unavailable';

const PRODUCTS = [
  /* ------------------------------------------------------------ Brasileirão */
  {
    id: 'flamengo-titular-2026', sku: 'PS-FLA-H-2026', team: 'Flamengo', season: '2026',
    model: 'Titular', category: 'Brasileirão', subcategory: 'Brasil', version: 'Torcedor',
    priceReference: 150, personalizationAvailable: true, deliveryType: 'Pronta entrega',
    featured: true, bestSeller: true, newArrival: false,
    description: 'Camisa titular do Flamengo em tecido leve e respirável, com escudo bordado e acabamento reforçado nas costuras.',
    folder: 'flamengo', slug: 'camisa-flamengo-titular-2026', imagesPending: true,
    sizes: sizes([A, 4], [A, 6], [L, 2], [E, 0], [X, 0])
  },
  {
    id: 'palmeiras-titular-2026', sku: 'PS-PAL-H-2026', team: 'Palmeiras', season: '2026',
    model: 'Titular', category: 'Brasileirão', subcategory: 'Brasil', version: 'Torcedor',
    priceReference: 150, personalizationAvailable: true, deliveryType: 'Pronta entrega',
    featured: true, bestSeller: true, newArrival: false,
    description: 'Camisa titular do Palmeiras, versão torcedor, com tecido dry premium e escudo aplicado.',
    folder: 'palmeiras', slug: 'camisa-palmeiras-titular-2026', imagesPending: true,
    sizes: sizes([A, 5], [A, 5], [A, 3], [L, 2], [E, 0])
  },
  {
    id: 'corinthians-titular-2026', sku: 'PS-COR-H-2026', team: 'Corinthians', season: '2026',
    model: 'Titular', category: 'Brasileirão', subcategory: 'Brasil', version: 'Torcedor',
    priceReference: 150, personalizationAvailable: true, deliveryType: 'Pronta entrega',
    featured: false, bestSeller: true, newArrival: false,
    description: 'Camisa titular do Corinthians em malha leve, com acabamento premium e corte confortável.',
    folder: 'corinthians', slug: 'camisa-corinthians-titular-2026', imagesPending: true,
    sizes: sizes([L, 2], [A, 4], [A, 4], [E, 0], [X, 0])
  },
  {
    id: 'sao-paulo-titular-2026', sku: 'PS-SAO-H-2026', team: 'São Paulo', season: '2026',
    model: 'Titular', category: 'Brasileirão', subcategory: 'Brasil', version: 'Torcedor',
    priceReference: 150, personalizationAvailable: true, deliveryType: 'Sob encomenda',
    featured: false, bestSeller: false, newArrival: true,
    description: 'Camisa titular do São Paulo com listras clássicas, tecido respirável e escudo aplicado.',
    folder: 'sao-paulo', slug: 'camisa-sao-paulo-titular-2026', imagesPending: true,
    sizes: sizes([E, 0], [E, 0], [E, 0], [E, 0], [E, 0])
  },
  {
    id: 'vasco-titular-2026', sku: 'PS-VAS-H-2026', team: 'Vasco da Gama', season: '2026',
    model: 'Titular', category: 'Brasileirão', subcategory: 'Brasil', version: 'Torcedor',
    priceReference: 150, personalizationAvailable: true, deliveryType: 'Pronta entrega',
    featured: false, bestSeller: false, newArrival: true,
    description: 'Camisa titular do Vasco da Gama com a faixa tradicional, em tecido leve e confortável.',
    folder: 'vasco', slug: 'camisa-vasco-titular-2026', imagesPending: true,
    sizes: sizes([A, 3], [A, 4], [L, 1], [E, 0], [E, 0])
  },
  {
    id: 'gremio-titular-2026', sku: 'PS-GRE-H-2026', team: 'Grêmio', season: '2026',
    model: 'Titular', category: 'Brasileirão', subcategory: 'Brasil', version: 'Torcedor',
    priceReference: 150, personalizationAvailable: true, deliveryType: 'Pronta entrega',
    featured: false, bestSeller: false, newArrival: false,
    description: 'Camisa titular do Grêmio em versão torcedor, com acabamento reforçado e caimento clássico.',
    folder: 'gremio', slug: 'camisa-gremio-titular-2026', imagesPending: true,
    sizes: sizes([A, 3], [A, 3], [A, 3], [L, 2], [X, 0])
  },
  {
    id: 'internacional-titular-2026', sku: 'PS-INT-H-2026', team: 'Internacional', season: '2026',
    model: 'Titular', category: 'Brasileirão', subcategory: 'Brasil', version: 'Torcedor',
    priceReference: 150, personalizationAvailable: true, deliveryType: 'Sob encomenda',
    featured: false, bestSeller: false, newArrival: false,
    description: 'Camisa titular do Internacional, versão torcedor, com tecido leve e escudo aplicado.',
    folder: 'internacional', slug: 'camisa-internacional-titular-2026', imagesPending: true,
    sizes: sizes([E, 0], [A, 2], [E, 0], [E, 0], [X, 0])
  },
  {
    id: 'flamengo-retro-1981', sku: 'PS-FLA-R-1981', team: 'Flamengo', season: 'Retrô 1981',
    model: 'Retrô', category: 'Retrôs', subcategory: 'Brasil', version: 'Torcedor',
    priceReference: 150, personalizationAvailable: false, deliveryType: 'Sob encomenda',
    featured: true, bestSeller: false, newArrival: false,
    description: 'Modelo retrô inspirado nos uniformes clássicos do Flamengo, com corte tradicional e gola em contraste.',
    folder: 'flamengo', slug: 'camisa-flamengo-retro-1981', imagesPending: true,
    sizes: sizes([E, 0], [E, 0], [L, 1], [E, 0], [X, 0])
  },

  /* ----------------------------------------------------------------- Europa */
  {
    id: 'real-madrid-titular-2025-2026', sku: 'PS-RMA-H-2526', team: 'Real Madrid', season: '2025/2026',
    model: 'Titular', category: 'Europa', subcategory: 'Espanha', version: 'Torcedor',
    priceReference: 150, personalizationAvailable: true, deliveryType: 'Pronta entrega',
    featured: true, bestSeller: true, newArrival: true,
    description: 'Camisa titular do Real Madrid, versão torcedor, em tecido dry premium com escudo bordado e acabamento de alta qualidade.',
    folder: 'real-madrid', slug: 'camisa-real-madrid-titular-2025-2026', imagesPending: false,
    sizes: sizes([A, 3], [A, 5], [L, 2], [E, 0], [X, 0])
  },
  {
    id: 'real-madrid-jogador-2025-2026', sku: 'PS-RMA-HP-2526', team: 'Real Madrid', season: '2025/2026',
    model: 'Titular', category: 'Europa', subcategory: 'Espanha', version: 'Jogador',
    priceReference: 150, personalizationAvailable: true, deliveryType: 'Sob encomenda',
    featured: false, bestSeller: false, newArrival: true,
    description: 'Versão jogador da camisa titular do Real Madrid, com caimento mais ajustado e tecido de maior performance.',
    folder: 'real-madrid', slug: 'camisa-real-madrid-jogador-2025-2026', imagesPending: true,
    sizes: sizes([E, 0], [E, 0], [E, 0], [E, 0], [E, 0])
  },
  {
    id: 'real-madrid-segundo-2025-2026', sku: 'PS-RMA-A-2526', team: 'Real Madrid', season: '2025/2026',
    model: 'Segundo uniforme', category: 'Europa', subcategory: 'Espanha', version: 'Torcedor',
    priceReference: 150, personalizationAvailable: true, deliveryType: 'Sob encomenda',
    featured: false, bestSeller: false, newArrival: true,
    description: 'Segundo uniforme do Real Madrid, em verde, versão torcedor, com tecido leve e escudo aplicado.',
    folder: 'real-madrid', slug: 'camisa-real-madrid-segundo-2025-2026', imagesPending: false,
    sizes: sizes([E, 0], [E, 0], [E, 0], [E, 0], [E, 0])
  },
  {
    id: 'barcelona-titular-2025-2026', sku: 'PS-BAR-H-2526', team: 'Barcelona', season: '2025/2026',
    model: 'Titular', category: 'Europa', subcategory: 'Espanha', version: 'Torcedor',
    priceReference: 150, personalizationAvailable: true, deliveryType: 'Pronta entrega',
    featured: true, bestSeller: true, newArrival: false,
    description: 'Camisa titular do Barcelona em versão torcedor, com tecido leve, escudo aplicado e acabamento premium.',
    folder: 'barcelona', slug: 'camisa-barcelona-titular-2025-2026', imagesPending: false,
    sizes: sizes([A, 4], [A, 6], [A, 3], [L, 2], [E, 0])
  },
  {
    id: 'manchester-city-titular-2025-2026', sku: 'PS-MCI-H-2526', team: 'Manchester City', season: '2025/2026',
    model: 'Titular', category: 'Europa', subcategory: 'Inglaterra', version: 'Torcedor',
    priceReference: 150, personalizationAvailable: true, deliveryType: 'Pronta entrega',
    featured: false, bestSeller: false, newArrival: true,
    description: 'Camisa titular do Manchester City, versão torcedor, com tecido respirável e acabamento reforçado.',
    folder: 'manchester-city', slug: 'camisa-manchester-city-titular-2025-2026', imagesPending: true,
    sizes: sizes([A, 2], [A, 4], [A, 2], [E, 0], [X, 0])
  },
  {
    id: 'manchester-united-titular-2025-2026', sku: 'PS-MUN-H-2526', team: 'Manchester United', season: '2025/2026',
    model: 'Titular', category: 'Europa', subcategory: 'Inglaterra', version: 'Torcedor',
    priceReference: 150, personalizationAvailable: true, deliveryType: 'Sob encomenda',
    featured: false, bestSeller: false, newArrival: false,
    description: 'Camisa titular do Manchester United em versão torcedor, com corte clássico e tecido leve.',
    folder: 'manchester-united', slug: 'camisa-manchester-united-titular-2025-2026', imagesPending: true,
    sizes: sizes([E, 0], [E, 0], [L, 1], [E, 0], [X, 0])
  },
  {
    id: 'liverpool-titular-2025-2026', sku: 'PS-LIV-H-2526', team: 'Liverpool', season: '2025/2026',
    model: 'Titular', category: 'Europa', subcategory: 'Inglaterra', version: 'Torcedor',
    priceReference: 150, personalizationAvailable: true, deliveryType: 'Pronta entrega',
    featured: false, bestSeller: true, newArrival: false,
    description: 'Camisa titular do Liverpool, versão torcedor, com escudo aplicado e acabamento premium.',
    folder: 'liverpool', slug: 'camisa-liverpool-titular-2025-2026', imagesPending: true,
    sizes: sizes([A, 3], [A, 3], [A, 4], [L, 1], [E, 0])
  },
  {
    id: 'arsenal-titular-2025-2026', sku: 'PS-ARS-H-2526', team: 'Arsenal', season: '2025/2026',
    model: 'Titular', category: 'Europa', subcategory: 'Inglaterra', version: 'Torcedor',
    priceReference: 150, personalizationAvailable: true, deliveryType: 'Pronta entrega',
    featured: false, bestSeller: false, newArrival: true,
    description: 'Camisa titular do Arsenal em versão torcedor, com tecido leve e caimento confortável.',
    folder: 'arsenal', slug: 'camisa-arsenal-titular-2025-2026', imagesPending: true,
    sizes: sizes([A, 2], [A, 3], [L, 2], [E, 0], [E, 0])
  },
  {
    id: 'psg-titular-2025-2026', sku: 'PS-PSG-H-2526', team: 'Paris Saint-Germain', season: '2025/2026',
    model: 'Titular', category: 'Europa', subcategory: 'França', version: 'Torcedor',
    priceReference: 150, personalizationAvailable: true, deliveryType: 'Pronta entrega',
    featured: true, bestSeller: false, newArrival: true,
    description: 'Camisa titular do Paris Saint-Germain, versão torcedor, com faixa central e acabamento premium.',
    folder: 'psg', slug: 'camisa-psg-titular-2025-2026', imagesPending: false,
    sizes: sizes([A, 3], [A, 4], [A, 2], [L, 1], [X, 0])
  },
  {
    id: 'bayern-munique-titular-2025-2026', sku: 'PS-BAY-H-2526', team: 'Bayern de Munique', season: '2025/2026',
    model: 'Titular', category: 'Europa', subcategory: 'Alemanha', version: 'Torcedor',
    priceReference: 150, personalizationAvailable: true, deliveryType: 'Sob encomenda',
    featured: false, bestSeller: false, newArrival: false,
    description: 'Camisa titular do Bayern de Munique em versão torcedor, com tecido dry e escudo aplicado.',
    folder: 'bayern-munique', slug: 'camisa-bayern-munique-titular-2025-2026', imagesPending: false,
    sizes: sizes([E, 0], [A, 2], [E, 0], [E, 0], [X, 0])
  },
  {
    id: 'borussia-dortmund-titular-2025-2026', sku: 'PS-BVB-H-2526', team: 'Borussia Dortmund', season: '2025/2026',
    model: 'Titular', category: 'Europa', subcategory: 'Alemanha', version: 'Torcedor',
    priceReference: 150, personalizationAvailable: true, deliveryType: 'Sob encomenda',
    featured: false, bestSeller: false, newArrival: true,
    description: 'Camisa titular do Borussia Dortmund em versão torcedor, com tecido leve e escudo aplicado.',
    folder: 'borussia-dortmund', slug: 'camisa-borussia-dortmund-titular-2025-2026', imagesPending: false,
    sizes: sizes([E, 0], [E, 0], [E, 0], [E, 0], [E, 0])
  },
  {
    id: 'milan-titular-2025-2026', sku: 'PS-MIL-H-2526', team: 'Milan', season: '2025/2026',
    model: 'Titular', category: 'Europa', subcategory: 'Itália', version: 'Torcedor',
    priceReference: 150, personalizationAvailable: true, deliveryType: 'Pronta entrega',
    featured: false, bestSeller: false, newArrival: false,
    description: 'Camisa titular do Milan, versão torcedor, com listras clássicas e tecido leve.',
    folder: 'milan', slug: 'camisa-milan-titular-2025-2026', imagesPending: true,
    sizes: sizes([A, 2], [A, 3], [L, 1], [E, 0], [X, 0])
  },
  {
    id: 'inter-milao-titular-2025-2026', sku: 'PS-INM-H-2526', team: 'Inter de Milão', season: '2025/2026',
    model: 'Titular', category: 'Europa', subcategory: 'Itália', version: 'Torcedor',
    priceReference: 150, personalizationAvailable: true, deliveryType: 'Sob encomenda',
    featured: false, bestSeller: false, newArrival: false,
    description: 'Camisa titular da Inter de Milão em versão torcedor, com acabamento premium e corte confortável.',
    folder: 'inter-milao', slug: 'camisa-inter-milao-titular-2025-2026', imagesPending: true,
    sizes: sizes([E, 0], [E, 0], [E, 0], [E, 0], [X, 0])
  },
  {
    id: 'barcelona-retro-1999', sku: 'PS-BAR-R-1999', team: 'Barcelona', season: 'Retrô 1999',
    model: 'Retrô', category: 'Retrôs', subcategory: 'Espanha', version: 'Torcedor',
    priceReference: 150, personalizationAvailable: false, deliveryType: 'Sob encomenda',
    featured: false, bestSeller: false, newArrival: false,
    description: 'Modelo retrô inspirado nos uniformes clássicos do Barcelona, com corte tradicional.',
    folder: 'barcelona', slug: 'camisa-barcelona-retro-1999', imagesPending: true,
    sizes: sizes([E, 0], [E, 0], [E, 0], [X, 0], [X, 0])
  },

  /* --------------------------------------------------------------- Seleções */
  {
    id: 'brasil-titular-2026', sku: 'PS-BRA-H-2026', team: 'Brasil', season: '2026',
    model: 'Titular', category: 'Seleções', subcategory: 'América do Sul', version: 'Torcedor',
    priceReference: 150, personalizationAvailable: true, deliveryType: 'Pronta entrega',
    featured: true, bestSeller: true, newArrival: true,
    description: 'Camisa titular da Seleção Brasileira, versão torcedor, em tecido leve com escudo aplicado.',
    folder: 'brasil', slug: 'camisa-brasil-titular-2026', imagesPending: true,
    sizes: sizes([A, 6], [A, 8], [A, 5], [L, 2], [E, 0])
  },
  {
    id: 'argentina-titular-2026', sku: 'PS-ARG-H-2026', team: 'Argentina', season: '2026',
    model: 'Titular', category: 'Seleções', subcategory: 'América do Sul', version: 'Torcedor',
    priceReference: 150, personalizationAvailable: true, deliveryType: 'Pronta entrega',
    featured: false, bestSeller: true, newArrival: true,
    description: 'Camisa titular da seleção da Argentina em versão torcedor, com listras clássicas.',
    folder: 'argentina', slug: 'camisa-argentina-titular-2026', imagesPending: true,
    sizes: sizes([A, 3], [A, 4], [A, 3], [E, 0], [X, 0])
  },
  {
    id: 'portugal-titular-2026', sku: 'PS-POR-H-2026', team: 'Portugal', season: '2026',
    model: 'Titular', category: 'Seleções', subcategory: 'Europa', version: 'Torcedor',
    priceReference: 150, personalizationAvailable: true, deliveryType: 'Sob encomenda',
    featured: false, bestSeller: false, newArrival: true,
    description: 'Camisa titular da seleção de Portugal, versão torcedor, com tecido respirável.',
    folder: 'portugal', slug: 'camisa-portugal-titular-2026', imagesPending: true,
    sizes: sizes([E, 0], [A, 2], [L, 1], [E, 0], [X, 0])
  },
  {
    id: 'franca-titular-2026', sku: 'PS-FRA-H-2026', team: 'França', season: '2026',
    model: 'Titular', category: 'Seleções', subcategory: 'Europa', version: 'Torcedor',
    priceReference: 150, personalizationAvailable: true, deliveryType: 'Sob encomenda',
    featured: false, bestSeller: false, newArrival: false,
    description: 'Camisa titular da seleção da França em versão torcedor, com escudo aplicado.',
    folder: 'franca', slug: 'camisa-franca-titular-2026', imagesPending: true,
    sizes: sizes([E, 0], [E, 0], [E, 0], [E, 0], [X, 0])
  },
  {
    id: 'brasil-retro-1994', sku: 'PS-BRA-R-1994', team: 'Brasil', season: 'Retrô 1994',
    model: 'Retrô', category: 'Retrôs', subcategory: 'América do Sul', version: 'Torcedor',
    priceReference: 150, personalizationAvailable: false, deliveryType: 'Sob encomenda',
    featured: true, bestSeller: false, newArrival: false,
    description: 'Modelo retrô inspirado nos uniformes clássicos da Seleção Brasileira, com corte tradicional.',
    folder: 'brasil', slug: 'camisa-brasil-retro-1994', imagesPending: true,
    sizes: sizes([E, 0], [L, 1], [E, 0], [E, 0], [X, 0])
  }
];

/* Completa cada produto com os campos derivados, evitando repetição no cadastro. */
PRODUCTS.forEach((p) => {
  p.name = `${p.team} — ${p.model} ${p.season}`;
  p.images = productImagePaths(p.folder, p.slug);
  p.placeholder = `assets/images/placeholders/${p.id}.svg`;
  p.careInstructions = p.careInstructions || DEFAULT_CARE;
  p.deliveryEstimate =
    p.deliveryType === 'Pronta entrega'
      ? 'Pronta entrega, sujeita a confirmação pelo WhatsApp'
      : 'Sob encomenda, prazo médio de 5 a 10 dias';
});

/** Busca um produto pelo id. */
function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}

/** Situação geral de estoque do produto, derivada dos tamanhos. */
function productAvailability(product) {
  const statuses = SIZE_ORDER.map((s) => product.sizes[s]?.status).filter(Boolean);
  if (statuses.includes('available')) return 'available';
  if (statuses.includes('low_stock')) return 'low_stock';
  if (statuses.includes('pre_order')) return 'pre_order';
  return 'unavailable';
}
