#!/usr/bin/env node
/* =========================================================================
   Gerador de páginas estáticas de produto
   -------------------------------------------------------------------------
   Por quê: o catálogo (catalogo.html) monta os cards via JavaScript a partir
   de assets/js/products.js. Isso é ótimo para filtros e busca em tempo real,
   mas significa que um crawler que não executa JS (e alguns não executam)
   não vê nome, preço ou descrição de nenhum produto — só uma <div> vazia.

   Este script gera, para cada produto, uma página HTML totalmente estática
   em produtos/<id>.html com o conteúdo essencial já no HTML (sem depender
   de JavaScript para existir): título, preço, tamanhos, descrição, imagem,
   JSON-LD Product. A parte interativa (adicionar ao orçamento, favoritar)
   continua funcionando nessas páginas via os mesmos scripts do site.

   Não depende de bundler nem de Node em produção: roda uma vez, aqui,
   antes do commit/deploy, e o resultado é puro HTML estático publicável
   no GitHub Pages.

   Uso:
     node scripts/generate-product-pages.mjs

   Rodar sempre que products.js mudar (produto novo, preço, estoque etc.)
   e commitar os arquivos gerados em produtos/.
   ========================================================================= */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT_DIR = path.join(ROOT, 'produtos');
const SITE_URL = 'https://jonathanbrunosb.github.io/primosports/';
const require = createRequire(import.meta.url);

/**
 * products.js e config.js usam `const` no escopo do próprio arquivo.
 * Anexar `module.exports = {...}` no fim faz o wrapper de módulo do Node
 * (CommonJS) enxergar essas mesmas bindings, sem precisar de bundler.
 */
function loadCommonJsGlobals(relPath, exportNames) {
  const src = fs.readFileSync(path.join(ROOT, relPath), 'utf8');
  const withExports = `${src}\nmodule.exports = { ${exportNames.join(', ')} };`;
  const tmpFile = path.join(ROOT, 'scripts', `.${path.basename(relPath)}.tmp.cjs`);
  fs.writeFileSync(tmpFile, withExports);
  try {
    return require(tmpFile);
  } finally {
    fs.unlinkSync(tmpFile);
  }
}

function loadProducts() {
  return loadCommonJsGlobals('assets/js/products.js', ['PRODUCTS', 'SIZE_ORDER', 'SIZE_STATUS', 'productAvailability']);
}

function loadConfig() {
  return loadCommonJsGlobals('assets/js/config.js', ['BUSINESS_CONFIG']);
}

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const currency = (v) => `R$ ${Number(v).toFixed(2).replace('.', ',')}`;

const SCHEMA_AVAILABILITY = {
  available: 'https://schema.org/InStock',
  low_stock: 'https://schema.org/LimitedAvailability',
  pre_order: 'https://schema.org/PreOrder',
  unavailable: 'https://schema.org/OutOfStock'
};

function buildSizesTable(product, SIZE_ORDER, SIZE_STATUS) {
  const rows = SIZE_ORDER
    .filter((size) => product.sizes[size])
    .map((size) => {
      const info = product.sizes[size];
      const status = SIZE_STATUS[info.status];
      return `          <tr><td>${size}</td><td class="size-status-${info.status}">${esc(status.label)}</td></tr>`;
    })
    .join('\n');
  return `        <table class="size-table">\n          <caption class="sr-only">Tamanhos disponíveis</caption>\n          <thead><tr><th>Tamanho</th><th>Disponibilidade</th></tr></thead>\n          <tbody>\n${rows}\n          </tbody>\n        </table>`;
}

function buildRelated(product, PRODUCTS) {
  const related = PRODUCTS
    .filter((p) => p.id !== product.id && (p.category === product.category || p.team === product.team))
    .slice(0, 4);
  if (!related.length) return '';
  const items = related.map((p) => `          <a class="related-card" href="${p.id}.html">
            <img src="../${p.placeholder}" alt="Camisa ${esc(p.team)} ${esc(p.model)} ${esc(p.season)}" width="300" height="300" loading="lazy" decoding="async" />
            <span>${esc(p.team)} ${esc(p.season)}</span>
          </a>`).join('\n');
  return `      <section class="section">
        <div class="container">
          <h2 class="product-category" style="margin-bottom:1rem">Produtos relacionados</h2>
          <div class="related-grid" style="padding:0">
${items}
          </div>
        </div>
      </section>\n`;
}

function buildPage(product, ctx) {
  const { PRODUCTS, SIZE_ORDER, SIZE_STATUS, productAvailability, BUSINESS_CONFIG } = ctx;
  const availability = productAvailability(product);
  const title = `${product.team} ${product.season} — ${product.model} ${product.version} | Primo's Sports`;
  const description = `${product.description} Preço de referência: ${currency(product.priceReference)}. Consulte tamanhos e disponibilidade pelo WhatsApp.`;
  const url = `${SITE_URL}produtos/${product.id}.html`;
  const image = `${SITE_URL}${product.imagesPending ? product.placeholder : product.images[0].src}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${product.team} ${product.model} ${product.season}`,
    sku: product.sku,
    description: product.description,
    category: product.category,
    image,
    brand: { '@type': 'Brand', name: "Primo's Sports" },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'BRL',
      price: String(product.priceReference),
      availability: SCHEMA_AVAILABILITY[availability],
      itemCondition: 'https://schema.org/NewCondition'
    }
  };

  const sizesTable = buildSizesTable(product, SIZE_ORDER, SIZE_STATUS);
  const relatedHtml = buildRelated(product, PRODUCTS);
  const careItems = product.careInstructions.map((c) => `          <li>${esc(c)}</li>`).join('\n');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="${url}" />
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#050505" />

  <meta property="og:type" content="product" />
  <meta property="og:locale" content="pt_BR" />
  <meta property="og:site_name" content="Primo's Sports" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${image}" />
  <meta name="twitter:card" content="summary_large_image" />

  <link rel="icon" href="../assets/images/brand/favicon-32x32.png" sizes="32x32" type="image/png" />
  <link rel="icon" href="../assets/images/brand/favicon-16x16.png" sizes="16x16" type="image/png" />
  <link rel="apple-touch-icon" href="../assets/images/brand/apple-touch-icon.png" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="../assets/css/variables.css" />
  <link rel="stylesheet" href="../assets/css/reset.css" />
  <link rel="stylesheet" href="../assets/css/main.css" />
  <link rel="stylesheet" href="../assets/css/components.css" />
  <link rel="stylesheet" href="../assets/css/responsive.css" />

  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body data-product-id="${product.id}">
  <a class="skip-link" href="#conteudo">Ir para o conteúdo</a>

  <header class="site-header">
    <div class="container nav-wrap">
      <button class="menu-toggle" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="mainNav"></button>
      <a class="brand" href="../index.html" aria-label="Primo's Sports — página inicial">
        <img src="../assets/images/brand/primos-sports-shield.png" alt="" width="40" height="40" />
        <span>PRIMO'S <b>SPORTS</b></span>
      </a>
      <nav class="main-nav" id="mainNav" aria-label="Menu principal">
        <a href="../index.html">Início</a>
        <a href="../catalogo.html">Camisas</a>
        <div class="nav-dropdown">
          <button type="button" class="nav-dropdown-toggle" aria-expanded="false" aria-controls="categoriasMenu">Categorias</button>
          <div class="nav-dropdown-menu" id="categoriasMenu">
            <a href="../catalogo.html?categoria=Brasileir%C3%A3o">Brasileirão</a>
            <a href="../catalogo.html?categoria=Europa">Europa</a>
            <a href="../catalogo.html?categoria=Sele%C3%A7%C3%B5es">Seleções</a>
            <a href="../catalogo.html?categoria=Retr%C3%B4s">Retrôs</a>
          </div>
        </div>
        <a href="../catalogo.html?promo=1">Promoções</a>
        <a href="../index.html#como-comprar">Como comprar</a>
        <a href="../index.html#contato">Contato</a>
      </nav>
      <div class="nav-actions">
        <a class="icon-btn" id="favoritesBtn" href="../catalogo.html?favoritos=1" aria-label="Ver favoritos">
          <span class="count-badge" id="favoritesCount" hidden>0</span>
        </a>
        <a class="icon-btn whatsapp-link" href="#" aria-label="Falar no WhatsApp" data-message="Gostaria de falar sobre as camisas."></a>
      </div>
    </div>
  </header>

  <main id="conteudo">
    <section class="page-hero">
      <div class="container">
        <nav class="breadcrumb" aria-label="Você está aqui">
          <a href="../index.html">Início</a><span>›</span>
          <a href="../catalogo.html?categoria=${encodeURIComponent(product.category)}">${esc(product.category)}</a><span>›</span>
          <span>${esc(product.team)}</span>
        </nav>
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="container modal-grid" style="padding:0">
        <div class="gallery">
          <div class="gallery-main">
            <img src="../${product.imagesPending ? product.placeholder : product.images[0].src}" alt="Camisa ${esc(product.team)} ${esc(product.model)} ${esc(product.season)} — versão ${esc(product.version)}" width="600" height="600" decoding="async" />
          </div>
          ${product.imagesPending ? '<p class="product-meta">Imagem ilustrativa. As fotos reais do produto serão publicadas em breve.</p>' : ''}
        </div>

        <div class="modal-body">
          <span class="product-category">${esc(product.category)} · ${esc(product.subcategory)}</span>
          <h1>${esc(product.team)} ${esc(product.season)}</h1>
          <p class="product-meta">${esc(product.model)} · Versão ${esc(product.version)} · Código ${esc(product.sku)}</p>
          <div class="modal-price">${currency(product.priceReference)}</div>
          <p class="product-meta">${esc(BUSINESS_CONFIG.priceNotice)} Leve 2 por ${currency(270)} ou 3 por ${currency(380)}.</p>

          <h2 class="product-category">Descrição</h2>
          <p>${esc(product.description)}</p>

          <h2 class="product-category">Tamanhos</h2>
${sizesTable}
          <p class="product-meta">${esc(product.deliveryEstimate)}</p>

          <h2 class="product-category">Cuidados</h2>
          <ul>
${careItems}
          </ul>

          <div class="trust-badges">
            <a class="trust-badge" href="../trocas-e-devolucoes.html">Consulte nossa política de troca</a>
            <div class="trust-badge">Pagamento combinado com você</div>
            <div class="trust-badge">Atendimento direto pelo WhatsApp</div>
          </div>

          <p class="notice">
            <strong>Como comprar:</strong> abra este produto no
            <a href="../catalogo.html#produto=${encodeURIComponent(product.id)}">catálogo interativo</a>
            para escolher o tamanho, a quantidade e enviar a consulta pelo WhatsApp com um clique.
          </p>

          <div class="hero-cta">
            <a class="btn btn-primary" href="../catalogo.html#produto=${encodeURIComponent(product.id)}">Ver no catálogo e comprar</a>
            <a class="btn btn-wa whatsapp-link" href="#" data-message="Olá! Tenho interesse na camisa ${esc(product.team)} ${esc(product.model)} ${esc(product.season)} (código ${esc(product.sku)}).">Consultar no WhatsApp</a>
          </div>
        </div>
      </div>
    </section>

${relatedHtml}  </main>

  <footer id="contato">
    <div class="container footer-grid">
      <div>
        <a class="brand" href="../index.html">
          <img src="../assets/images/brand/primos-sports-shield.png" alt="" width="40" height="40" loading="lazy" />
          <span>PRIMO'S <b>SPORTS</b></span>
        </a>
        <p data-config="slogan"></p>
        <p data-config="serviceRegionsText"></p>
        <p data-config="serviceHours"></p>
        <p data-legal="companyName"></p>
        <p data-legal="cnpj"></p>
        <p data-legal="address"></p>
      </div>
      <nav aria-label="Navegação do rodapé">
        <h4>Navegação</h4>
        <a href="../index.html">Início</a>
        <a href="../catalogo.html">Catálogo</a>
        <a href="../catalogo.html?promo=1">Promoções</a>
        <a href="../index.html#precos">Tabela de preços</a>
        <a href="../index.html#quem-somos">Quem somos</a>
      </nav>
      <div>
        <h4>Atendimento</h4>
        <a class="whatsapp-link" href="#" data-message="Preciso de atendimento.">WhatsApp</a>
        <a data-config-href="email" href="#" data-config="email"></a>
        <a data-config-href="instagram" href="#" target="_blank" rel="noopener noreferrer" data-config="instagramHandle"></a>
        <h4 style="margin-top:1rem">Formas de pagamento</h4>
        <div class="footer-payments" data-payment-methods></div>
      </div>
      <nav aria-label="Informações institucionais">
        <h4>Informações</h4>
        <a href="../entrega-e-pagamento.html">Entrega e pagamento</a>
        <a href="../trocas-e-devolucoes.html">Trocas e devoluções</a>
        <a href="../politica-de-privacidade.html">Política de privacidade</a>
        <a href="../termos-de-uso.html">Termos de uso</a>
      </nav>
    </div>
    <div class="container footer-bottom">
      © <span id="currentYear">2026</span> Primo's Sports. Todos os direitos reservados.
    </div>
  </footer>

  <a class="whatsapp-float whatsapp-link" href="#" aria-label="Falar no WhatsApp" data-message="Vim pela página do produto ${esc(product.team)} ${esc(product.season)}."></a>
  <div class="overlay" id="overlay"></div>
  <div class="toast-stack" id="toastStack" aria-live="polite" aria-atomic="false"></div>

  <script src="../assets/js/config.js" defer></script>
  <script src="../assets/js/products.js" defer></script>
  <script src="../assets/js/storage.js" defer></script>
  <script src="../assets/js/validation.js" defer></script>
  <script src="../assets/js/whatsapp.js" defer></script>
  <script src="../assets/js/cart.js" defer></script>
  <script src="../assets/js/catalog.js" defer></script>
  <script src="../assets/js/product-modal.js" defer></script>
  <script src="../assets/js/main.js" defer></script>
</body>
</html>
`;
}

async function main() {
  const { PRODUCTS, SIZE_ORDER, SIZE_STATUS, productAvailability } = await loadProducts();
  const { BUSINESS_CONFIG } = loadConfig();

  fs.mkdirSync(OUT_DIR, { recursive: true });
  // limpa páginas de produtos removidos do catálogo
  for (const file of fs.readdirSync(OUT_DIR)) {
    if (file.endsWith('.html') && !PRODUCTS.some((p) => `${p.id}.html` === file)) {
      fs.unlinkSync(path.join(OUT_DIR, file));
      console.log('removido (produto não existe mais):', file);
    }
  }

  const ctx = { PRODUCTS, SIZE_ORDER, SIZE_STATUS, productAvailability, BUSINESS_CONFIG };
  for (const product of PRODUCTS) {
    const html = buildPage(product, ctx);
    fs.writeFileSync(path.join(OUT_DIR, `${product.id}.html`), html);
  }
  console.log(`Geradas ${PRODUCTS.length} páginas em produtos/.`);

  updateSitemap(PRODUCTS);
}

function updateSitemap(PRODUCTS) {
  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  let xml = fs.readFileSync(sitemapPath, 'utf8');
  const date = new Date().toISOString().slice(0, 10);

  const START = '  <!-- INÍCIO: páginas de produto geradas por scripts/generate-product-pages.mjs -->';
  const END = '  <!-- FIM: páginas de produto -->';
  const startIdx = xml.indexOf(START);
  const endIdx = xml.indexOf(END);

  const productUrls = PRODUCTS.map((p) => `  <url>
    <loc>${SITE_URL}produtos/${p.id}.html</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n');

  const block = `${START}\n${productUrls}\n${END}`;

  if (startIdx >= 0 && endIdx >= 0) {
    xml = xml.slice(0, startIdx) + block + xml.slice(endIdx + END.length);
  } else {
    xml = xml.replace('</urlset>', `${block}\n</urlset>`);
  }
  fs.writeFileSync(sitemapPath, xml);
  console.log('sitemap.xml atualizado com', PRODUCTS.length, 'URLs de produto.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
