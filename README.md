# Primo's Sports — site catálogo

Site institucional e catálogo comercial de camisas de clubes brasileiros, internacionais e
seleções. **Não há pagamento online nesta versão**: o site organiza a escolha do cliente e
envia a consulta pronta para o WhatsApp Business, onde a venda é fechada.

Feito em HTML, CSS e JavaScript puro, sem build, sem backend e sem banco de dados —
compatível com GitHub Pages, inclusive quando publicado em subdiretório.

---

## Sumário

- [Como abrir localmente](#como-abrir-localmente)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Como alterar informações da marca](#como-alterar-informações-da-marca)
- [Como trocar o número do WhatsApp](#como-trocar-o-número-do-whatsapp)
- [Como alterar os preços](#como-alterar-os-preços)
- [Como cadastrar produtos](#como-cadastrar-produtos)
- [Como gerar as páginas de produto (SEO)](#como-gerar-as-páginas-de-produto-seo)
- [Como incluir as imagens](#como-incluir-as-imagens)
- [Como alterar o estoque por tamanho](#como-alterar-o-estoque-por-tamanho)
- [Como publicar no GitHub Pages](#como-publicar-no-github-pages)
- [Domínio próprio e HTTPS](#domínio-próprio-e-https)
- [Google Search Console e Analytics](#google-search-console-e-analytics)
- [Favicon e imagem de compartilhamento](#favicon-e-imagem-de-compartilhamento)
- [Monitoramento de disponibilidade](#monitoramento-de-disponibilidade)
- [Como testar](#como-testar)
- [Como executar o Lighthouse](#como-executar-o-lighthouse)
- [Dados fictícios a substituir](#dados-fictícios-a-substituir)
- [Checklist de lançamento](#checklist-de-lançamento)

---

## Como abrir localmente

Os arquivos são estáticos, mas **não abra pelo duplo clique** (`file://`): alguns recursos do
navegador não funcionam nesse modo. Rode um servidor local:

```bash
# Python 3 (já vem instalado na maioria dos sistemas)
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`.

Alternativas: extensão **Live Server** no VS Code, ou `npx serve .`.

---

## Estrutura de pastas

```
/
├── index.html                    Home: hero, categorias, destaques, preços, quem somos
├── catalogo.html                 Catálogo completo com busca e filtros
├── entrega-e-pagamento.html
├── trocas-e-devolucoes.html
├── politica-de-privacidade.html
├── termos-de-uso.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── .nojekyll                     Impede o Jekyll de processar o site no GitHub Pages
├── .github/workflows/uptime.yml  Verificação básica de disponibilidade
├── produtos/                     ⭐ Uma página estática por produto (gerada, ver abaixo)
├── scripts/
│   └── generate-product-pages.mjs  Gera produtos/*.html e atualiza o sitemap
└── assets/
    ├── css/
    │   ├── variables.css         Cores, fontes, espaçamentos (comece por aqui)
    │   ├── reset.css
    │   ├── main.css              Layout e seções
    │   ├── components.css        Botões, cards, modal, drawer, filtros
    │   └── responsive.css        Breakpoints
    ├── js/
    │   ├── config.js             ⭐ TODOS os dados da marca ficam aqui
    │   ├── products.js           ⭐ Catálogo de produtos e estoque
    │   ├── storage.js            localStorage (carrinho e favoritos)
    │   ├── validation.js         Sanitização e validação de entradas
    │   ├── whatsapp.js           Montagem das mensagens
    │   ├── cart.js               Carrinho de orçamento
    │   ├── catalog.js            Render dos cards, busca, filtros
    │   ├── product-modal.js      Página de detalhe do produto (modal)
    │   └── main.js               Cabeçalho, drawer, toasts, inicialização
    └── images/
        ├── brand/                Logo, favicon, imagem de compartilhamento
        ├── banners/              Artes das categorias
        ├── placeholders/         Imagens provisórias dos produtos
        └── products/             ⭐ Fotos reais, uma pasta por time
```

Os dois arquivos que você vai mexer no dia a dia são `assets/js/config.js` e
`assets/js/products.js`.

---

## Como alterar informações da marca

Tudo vem de `assets/js/config.js`. Alterou lá, mudou no site inteiro — cabeçalho, rodapé,
páginas de política e mensagens de WhatsApp.

```js
const BUSINESS_CONFIG = {
  brandName: "Primo's Sports",
  whatsappNumber: '5581999999999',
  instagramUrl: 'https://www.instagram.com/primos.sports',
  email: 'primosports2026@gmail.com',
  deliveryMessage: 'Frete grátis para a Região Metropolitana do Recife...',
  serviceHours: 'Atendimento de domingo a domingo.',
  // ...
};
```

> **Nunca** escreva o telefone, o e-mail ou textos institucionais direto no HTML. Se um dado
> aparece em cinco arquivos, são cinco lugares para esquecer de atualizar depois.

Dados cadastrais (razão social, CNPJ, endereço) ficam em `BUSINESS_CONFIG.legal` e estão
**vazios de propósito**. Enquanto vazios, o site simplesmente não exibe esses campos — nada de
CNPJ inventado numa página publicada. Preencha e eles aparecem sozinhos no rodapé.

---

## Como trocar o número do WhatsApp

1. Abra `assets/js/config.js`;
2. Troque `whatsappNumber` pelo número oficial, **apenas dígitos**, com país e DDD:
   `5581988887777`;
3. Troque `whatsappIsPlaceholder: true` para `false`.

É o único lugar do projeto onde o número existe. Todos os botões, o flutuante e as mensagens
de orçamento passam a usá-lo automaticamente.

---

## Como alterar os preços

Em `assets/js/config.js`, dentro de `pricing`:

```js
packages: [
  { quantity: 1, total: 150, savings: 0,  label: '1 camisa' },
  { quantity: 2, total: 270, savings: 30, label: '2 camisas', highlight: true },
  { quantity: 3, total: 380, savings: 70, label: '3 camisas' }
]
```

Os valores exibidos nos cards da home estão escritos no HTML por questão de performance
(aparecem antes do JS carregar) — ao mudar a tabela, atualize também a seção
`id="precos"` do `index.html`.

**Regra para 4 ou mais camisas:** ainda não definida comercialmente. Por isso o sistema
**não calcula nada** acima de 3 unidades: exibe "Consulte condição especial" e envia o
orçamento para o WhatsApp sem valor estimado. Quando a regra for definida, acrescente o
pacote no array acima. Não deixe o código extrapolar a promoção sozinho.

---

## Como cadastrar produtos

Em `assets/js/products.js`, copie um bloco existente e ajuste:

```js
{
  id: 'flamengo-titular-2026',        // único; vira o link do produto (#produto=...)
  sku: 'PS-FLA-H-2026',
  team: 'Flamengo',
  season: '2026',
  model: 'Titular',                   // Titular, Away, Retrô...
  category: 'Brasileirão',            // Brasileirão | Europa | Seleções | Retrôs
  subcategory: 'Brasil',              // país ou liga
  version: 'Torcedor',                // Torcedor | Jogador
  priceReference: 150,
  personalizationAvailable: true,
  deliveryType: 'Pronta entrega',     // ou 'Sob encomenda'
  featured: true, bestSeller: true, newArrival: false,
  description: '...',
  folder: 'flamengo',                 // pasta em assets/images/products/
  slug: 'camisa-flamengo-titular-2026',
  imagesPending: true,                // false quando as fotos reais existirem
  sizes: sizes([A, 4], [A, 6], [L, 2], [E, 0], [X, 0])  // P, M, G, GG, XG
}
```

Os filtros do catálogo (categorias, times, temporadas, versões) são gerados **a partir dos
próprios produtos**, então não há lista para atualizar em paralelo: cadastrou o produto, o
filtro aparece.

Depois de cadastrar, alterar preço, estoque ou qualquer outro dado de produto, rode o gerador
de páginas (próxima seção) para que a versão estática fique atualizada antes do deploy.

---

## Como gerar as páginas de produto (SEO)

O catálogo (`catalogo.html`) monta os cards via JavaScript — ótimo para busca e filtro em
tempo real, mas invisível para quem (ou o que) não executa JavaScript. Por isso cada produto
também tem uma página estática própria em `produtos/<id>.html`, com nome, preço, tamanhos e
descrição já escritos no HTML, além de dados estruturados (`JSON-LD Product`) para SEO.

Sempre que alterar `assets/js/products.js` (produto novo, preço, estoque, descrição...), rode:

```bash
node scripts/generate-product-pages.mjs
```

O script:

- Lê os produtos diretamente de `products.js` (mesma fonte de dados do site, sem duplicar
  informação);
- Gera/atualiza um `.html` por produto em `produtos/`;
- Remove páginas de produtos que não existem mais no catálogo;
- Atualiza `sitemap.xml` com a URL de cada produto.

Não precisa de Node em produção — o resultado é HTML estático puro, publicado como qualquer
outro arquivo do repositório. Rode o script localmente, confira o resultado, e comite os
arquivos gerados junto com a mudança em `products.js`.

Os cards do catálogo linkam para essas páginas (`<a href="produtos/...">`) com um
`preventDefault` que abre o modal para quem tem JavaScript — a página estática funciona tanto
como destino real do link quanto como reforço de SEO.

---

## Como incluir as imagens

Enquanto não houver fotos reais, o site usa placeholders locais em
`assets/images/placeholders/`, claramente marcados como "IMAGEM DEMONSTRATIVA".

Para publicar as fotos de um produto:

1. Salve os arquivos em `assets/images/products/<pasta-do-time>/` usando o padrão de nome
   que já está declarado no produto:

   ```
   camisa-real-madrid-titular-2025-2026-frente.webp
   camisa-real-madrid-titular-2025-2026-costas.webp
   camisa-real-madrid-titular-2025-2026-escudo.webp
   camisa-real-madrid-titular-2025-2026-tecido.webp
   camisa-real-madrid-titular-2025-2026-detalhe.webp
   ```

2. Troque `imagesPending: true` para `false` naquele produto.

Recomendações: formato **WebP**, quadradas (1:1), no máximo ~1200 px de lado e ~150 KB.
Nomes em minúsculas, sem acentos e com hífen — ajuda no Google Imagens.

> Use apenas fotos suas ou com autorização de uso. Não copie imagens de sites de clubes,
> marcas esportivas ou concorrentes.

**Produtos já com foto real:** Flamengo titular, Palmeiras, Grêmio, Santa Cruz, Sport
Recife, Real Madrid titular e segundo uniforme, Barcelona, Paris Saint-Germain, Bayern de
Munique, Borussia Dortmund, Liverpool titular, Manchester City, Manchester United, Arsenal
(uniforme alternativo), Brasil, Argentina, França e Portugal, a partir de fotos fornecidas
com autorização do fornecedor.

> **Fique de olho em duplicatas:** o fornecedor já reenviou a mesma foto do Bayern de
> Munique identificada com o nome de arquivo "bayer" (igual ao lote anterior — o
> patrocinador Deutsche Telekom, exclusivo do Bayern, denuncia o erro no nome). Antes de
> processar qualquer lote novo, confira se o time já tem foto real aplicada e compare a
> pose/enquadramento antes de substituir — nem toda reenvio é upgrade. O fundo já veio recortado/transparente em alguns arquivos;
nos demais, o fundo branco foi removido por detecção de componentes conectados (mesma
técnica usada na logo).

Para a maioria desses produtos, as fotos `-escudo`, `-tecido` e `-detalhe` foram geradas
por recorte automático da foto de frente — não são fotos dedicadas de cada detalhe.
Substitua por close-ups reais quando tiver disponível, mantendo os mesmos nomes de arquivo.
**Liverpool e Arsenal já usam close-ups reais** (os arquivos `zoom 1/2/3` enviados pelo
fornecedor viraram, respectivamente, `-detalhe`, `-escudo` e `-tecido`) — é o padrão
preferido para os próximos produtos.

> Fotos com halo/sombra suave ao redor da peça exigem limiar mais permissivo no recorte,
> seguido de fechamento morfológico para devolver as partes brancas da própria camisa
> (gola, listras de ombro) que encostam na silhueta. Só o limiar conservador deixa auréola;
> só o permissivo come as listras.

**Quando o limiar não resolve (camisas claras):** nas fotos das seleções o fundo tem sombra
de estúdio que varia de 255 até ~176. Na camisa da Argentina, que é branca, essa faixa é a
mesma do tecido — nenhum limiar separa os dois. Nesses casos use **GrabCut** semeado por
cor: saturação alta ou pixel escuro marca tecido certo, a moldura externa marca fundo
certo, e o algoritmo refina a borda. Detalhes que valem lembrar:

- Some uma margem artificial antes de segmentar quando a foto é apertada (a do Brasil
  encosta nas bordas), senão a moldura de "fundo certo" cai sobre a própria peça.
- Em peças de cor forte, a franja clara que sobra na borda pode ser removida por
  saturação. **Não faça isso em camisa branca** — comeria a borda real do tecido.

**Quando a foto já vem com alfa** (Brasil, Palmeiras, Manchester City, Portugal), não
segmente nada: use o alfa de origem. Só redimensione com o **alfa premultiplicado** — o
resize comum trata RGB e alfa em separado e faz a cor da área transparente vazar na
borda. Confira sempre: cada fornecedor manda um fundo invisível de cor diferente (a do
Brasil era amarelada), e sem premultiplicar sobra um halo dessa cor em volta da peça.

### Banners de categoria

Cada card em "Escolha sua categoria" usa uma arte 4:3 em `assets/images/banners/`
(`categoria-brasileirao.webp`, `categoria-europa.webp`, `categoria-selecoes.webp`,
`categoria-retros.webp`), fornecidas pelo lojista e convertidas para WebP 960×720
(~70–90 KB cada, contra 2,3 MB do PNG original). Os PNGs de origem não ficam no
repositório — depois de convertidos, não têm mais uso no site.

> O nome da categoria **já vem gravado na arte**. Por isso o `<h3>` do card fica com a
> classe `sr-only`: continua existindo para leitores de tela e para o Google, mas não
> aparece duplicado na tela. Se trocar por uma arte sem o nome gravado, remova o `sr-only`.

### Imagens do hero (primeira dobra da home)

Toda a arte do hero é **gerada por script** (numpy/Pillow) — nada de terceiros, sem risco
de licença. As três camisas são **mockups genéricos**: silhueta em gola V nas cores dos
times, sem escudo, patrocinador ou marca. As fotos reais dos produtos continuam onde
importam para vender: no catálogo e nas páginas de produto.

| Arquivo | Uso | Peso |
|---|---|---|
| `camisa-flamengo-hero.webp` | mockup rubro-negro, em primeiro plano | 43 KB |
| `camisa-real-madrid-hero.webp` | mockup branco, ao centro | 47 KB |
| `camisa-barcelona-hero.webp` | mockup azul e grená, ao fundo | 42 KB |
| `hero-stadium-background.webp` | estádio noturno com refletores | 39 KB |
| `hero-smoke-green.webp` | fumaça verde na base | 84 KB |

**Ordem das camadas do hero** (erra fácil): fundo `z-index: 0`, vinheta `.hero::before`
`z-index: 1`, fumaça `z-index: 2`, conteúdo `z-index: 3`. Se a fumaça for para trás da
vinheta ela simplesmente some.

**Dose da fumaça e do gramado:** as duas passam fácil do ponto. Fumaça acima de ~0.65 de
opacidade, ou cobrindo mais que a faixa inferior, vira uma parede verde que come a
legibilidade do título. O gramado do fundo também: na referência ele é discreto e quem dá
o verde forte é a fumaça, não o campo.

Todos dentro da meta de performance do projeto (fundo < 250 KB, camisa principal < 180 KB,
camisas de apoio < 120 KB, névoa < 80 KB). Para substituir por fotos reais, mantenha os
mesmos nomes de arquivo e proporção aproximada (camisas em pé, fundo transparente ou já
recortado) — nenhum HTML ou CSS precisa mudar. Atualize também o `alt` de cada `<img>` em
`index.html` para descrever a foto real.

---

## Como alterar o estoque por tamanho

No campo `sizes` de cada produto, usando os atalhos definidos no topo do arquivo:

| Atalho | Status | Como aparece | Selecionável |
|---|---|---|---|
| `A` | `available` | Disponível (verde) | sim |
| `L` | `low_stock` | Últimas unidades (amarelo) | sim |
| `E` | `pre_order` | Sob encomenda (azul), 5 a 10 dias | sim |
| `X` | `unavailable` | Indisponível (cinza, riscado) | **não** |

```js
sizes: sizes([A, 4], [A, 6], [L, 2], [E, 0], [X, 0])
//              P       M       G       GG      XG
```

O segundo valor é a quantidade. Ela **não aparece na tela** por padrão, porque os números
atuais são demonstrativos. Quando o estoque for real, mude `SHOW_STOCK_QUANTITY` para `true`
no topo de `products.js`.

---

## Como publicar no GitHub Pages

1. No repositório, vá em **Settings → Pages**;
2. Em *Source*, escolha **Deploy from a branch**;
3. Selecione a branch (`main`) e a pasta `/ (root)`;
4. Salve. Em poucos minutos o site fica no ar em
   `https://<usuario>.github.io/primosports/`.

O arquivo `.nojekyll` já está no projeto — ele impede o Jekyll de ignorar pastas iniciadas com
underscore. Todos os caminhos do site são relativos, então funciona igualmente na raiz de um
domínio ou dentro de um subdiretório.

**Uma exceção importante:** `404.html` é servido pelo GitHub Pages a partir de qualquer URL
inexistente, inclusive caminhos profundos. Por isso ele tem um pequeno script no `<head>` que
define a raiz do site. Se você **renomear o repositório**, atualize a constante `REPO_NAME`
dentro de `404.html`.

---

## Domínio próprio e HTTPS

1. Compre o domínio e, no painel do provedor de DNS, crie:
   - **`www`** → registro `CNAME` apontando para `<usuario>.github.io`;
   - **domínio raiz** (`primossports.com.br`) → quatro registros `A` para os IPs do GitHub
     Pages: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
     (ou um `ALIAS`/`ANAME` para `<usuario>.github.io`, se o provedor suportar);
2. Em **Settings → Pages → Custom domain**, informe o domínio e salve. O GitHub cria o arquivo
   `CNAME` no repositório automaticamente — **não crie esse arquivo manualmente antes de ter
   o domínio**, senão o site sai do ar;
3. Aguarde a validação e marque **Enforce HTTPS** (o certificado é emitido de graça);
4. Escolha **um** endereço canônico (com `www` ou sem) e deixe o outro apenas redirecionando.
   Apontar os dois para destinos diferentes é o que costuma causar loop de redirecionamento.

Depois de configurar o domínio, atualize também:

- `seo.siteUrl` em `assets/js/config.js`;
- as tags `<link rel="canonical">` e `og:url` de cada `.html`;
- as URLs de `sitemap.xml` e `robots.txt`;
- a URL do workflow `.github/workflows/uptime.yml`;
- a constante `REPO_NAME` em `404.html` (com domínio próprio a raiz passa a ser `/`).

---

## Google Search Console e Analytics

**Search Console**

1. Acesse [search.google.com/search-console](https://search.google.com/search-console);
2. Adicione a propriedade pela URL do site (prefixo de URL);
3. Verifique a propriedade — a forma mais simples é o registro DNS `TXT` ou a meta tag de
   verificação no `<head>` do `index.html`;
4. Em *Sitemaps*, envie `sitemap.xml`.

**Google Analytics 4** (opcional, só ative se realmente for usar)

1. Crie a propriedade GA4 e copie o *Measurement ID* (formato `G-XXXXXXXXXX`);
2. Em `assets/js/config.js`:

   ```js
   analytics: {
     enabled: true,
     measurementId: 'G-XXXXXXXXXX'
   }
   ```

O script só é carregado quando `enabled === true` **e** o ID tem formato válido. Enquanto
estiver desligado, nenhum cookie não essencial é criado — por isso o site **não exibe banner
de cookies**. Se ativar o Analytics, é preciso incluir o aviso de cookies e atualizar a
Política de Privacidade. Um banner de cookies num site que não usa cookies é enganoso.

**Perfil da Empresa no Google:** cadastre em [business.google.com](https://business.google.com)
informando região de atendimento (Recife e Maceió), horário e o link do site. Como o
atendimento é por WhatsApp e não há loja física, cadastre como negócio de área de serviço.

---

## Favicon e imagem de compartilhamento

A logo oficial já está aplicada em `assets/images/brand/`, recortada a partir do arquivo
`logo-primos-original.jpeg` (mantido no repositório como referência para gerar novos recortes).

| Arquivo | Uso | Tamanho | Fundo |
|---|---|---|---|
| `logo-primos-original.jpeg` | arquivo-fonte da logo, não usado diretamente no site | 1320 × 924 | branco |
| `primos-sports-shield.png` | escudo, cabeçalho e rodapé | 160 × 160 | **transparente** |
| `primos-sports-logo.png` | logo completa (escudo + PRIMO'S SPORTS) | 600 × 600 | transparente (recorte automático, pode ter pequenas imperfeições na borda do texto) |
| `favicon-32x32.png` / `favicon-16x16.png` | ícone da aba | 32×32 / 16×16 | sólido (marca) |
| `apple-touch-icon.png` | ícone ao salvar no iPhone | 180 × 180 | sólido (marca) |
| `social-share-primos-sports.jpg` | pré-visualização de link no WhatsApp/Instagram | 1200 × 630 | sólido |

O fundo branco original foi removido via detecção de componentes conectados (mantém intactos
os brilhos metálicos do escudo, que não tocam a borda da imagem). Favicon e apple-touch-icon
usam fundo sólido escuro de propósito — a maioria dos navegadores não trata bem ícone
transparente sobre aba clara.

Se receber uma versão em alta resolução com fundo já transparente (arquivo `.png` de verdade,
não JPEG), é só substituir os arquivos acima mantendo os mesmos nomes e proporções — nenhum
HTML precisa mudar.

> Ao trocar a logo, use o arquivo com fundo transparente quando possível. Não recorte o fundo
> "na mão" nem estique a imagem para caber.

---

## Monitoramento de disponibilidade

O GitHub Pages não oferece monitoramento com alertas. O projeto inclui
`.github/workflows/uptime.yml`, que verifica a cada 6 horas se a página inicial responde
`200`. O resultado fica na aba **Actions**; ele **não envia notificações** (isso exigiria
configurar segredos).

Para receber alerta no celular quando o site cair, use um serviço externo gratuito:
[UptimeRobot](https://uptimerobot.com), [Better Stack](https://betterstack.com) ou
[StatusCake](https://www.statuscake.com). Basta cadastrar a URL do site.

---

## Como testar

Não há suíte automatizada publicada no repositório, mas o roteiro usado a cada mudança é:

1. Sirva o site localmente (`python3 -m http.server 8000`);
2. Catálogo: busque um time, aplique e limpe filtros, confira o contador de resultados;
3. Produto: abra o modal, tente adicionar sem tamanho (deve bloquear), selecione um tamanho
   e adicione — confira o toast e o carrinho;
4. Carrinho: mude quantidade e tamanho, confira o cálculo do pacote (1/2/3/4+) e a mensagem
   de incentivo, esvazie o carrinho;
5. Envie a consulta e confira o texto final da mensagem do WhatsApp antes de realmente enviar;
6. Recarregue a página e confirme que o carrinho e os favoritos persistiram;
7. Repita em 320px, 768px e 1366px, e no mobile real quando possível;
8. Abra o DevTools → Console e confira que não há nenhum erro em nenhuma página.

## Como executar o Lighthouse

1. Sirva o site localmente ou use a URL já publicada;
2. No Chrome, abra o DevTools → aba **Lighthouse**;
3. Marque **Performance**, **Accessibility**, **Best practices** e **SEO**, modo **Mobile**;
4. Rode e confira as quatro notas — a meta do projeto é Performance > 85 e as demais > 90;
5. Priorize corrigir o que o próprio relatório listar como maior impacto antes de repetir.

---

## Dados fictícios a substituir

Tudo que ainda é provisório está marcado no código com o comentário `PENDENTE:`.

| O que | Onde | Situação |
|---|---|---|
| Número do WhatsApp | `config.js` → `whatsappNumber` | **fictício** (`5581999999999`) |
| Produtos e estoque | `products.js` | demonstrativos |
| Fotos dos produtos | `assets/images/products/` | 19 de 30 produtos com foto real (Flamengo, Palmeiras, Grêmio, Santa Cruz, Sport Recife, Real Madrid titular e segundo uniforme, Barcelona, PSG, Bayern de Munique, Borussia Dortmund, Liverpool, Manchester City, Manchester United, Arsenal alternativo, Brasil, Argentina, França, Portugal); os demais usam placeholder |
| Detalhes da camisa do Brasil | `assets/images/products/brasil/` | Só veio a foto do escudo; `-tecido` e `-detalhe` são recortes automáticos da frente. As de Argentina e França usam os três close-ups reais |
| Uniforme do Arsenal alternativo | `products.js` → `arsenal-alternativo-2025-2026` | **PENDENTE:** confirmar com o fornecedor se é o segundo ou o terceiro uniforme (a foto é azul-marinho, não o titular vermelho) |
| Logo, favicon, imagem social | `assets/images/brand/` | ✅ logo oficial aplicada |
| Razão social, CNPJ, endereço | `config.js` → `legal` | vazios (não exibidos) |
| Regra para 4+ camisas | `config.js` → `pricing` | não definida (vai para consulta) |
| Valor da personalização | — | não definido (confirmado no atendimento) |
| URL do site | `config.js`, `sitemap.xml`, tags canônicas | GitHub Pages padrão |

O que **não** foi inventado, propositalmente: CNPJ, endereço, avaliações de clientes,
parcelamento, garantia, prazo exato de entrega, frete fora de Recife e Maceió e qualquer
condição comercial não informada.

---

## Checklist de lançamento

```
[ ] Substituir o número fictício do WhatsApp
[ ] Inserir fotos reais dos produtos
[ ] Validar catálogo
[ ] Validar tamanhos
[ ] Validar estoque
[ ] Validar preços
[ ] Definir regra para 4 ou mais camisas
[ ] Definir valor de personalização
[ ] Inserir logo transparente
[ ] Inserir favicon
[ ] Inserir imagem de compartilhamento
[ ] Validar política de troca
[ ] Validar política de privacidade
[ ] Inserir CNPJ, se aplicável
[ ] Inserir razão social, se aplicável
[ ] Inserir endereço comercial, se aplicável
[ ] Configurar domínio
[ ] Configurar HTTPS
[ ] Configurar Search Console
[ ] Configurar Analytics, se aprovado
[ ] Testar Android
[ ] Testar iPhone
[ ] Testar Chrome
[ ] Testar Safari
[ ] Testar Edge
[ ] Testar WhatsApp
[ ] Testar carrinho
[ ] Testar filtros
[ ] Testar formulário
[ ] Rodar scripts/generate-product-pages.mjs após qualquer mudança em products.js
[ ] Executar Lighthouse
[ ] Validar acessibilidade
[ ] Revisar ortografia
```

---

## Evolução futura

A arquitetura já está preparada para crescer sem reescrita:

- `products.js` isola os dados do HTML — trocar por uma API ou por um `products.json` servido
  por backend afeta um arquivo só;
- `cart.js` e `whatsapp.js` são independentes: um checkout com pagamento entraria ao lado do
  envio por WhatsApp, sem substituí-lo;
- `storage.js` já versiona o schema (`version: 1`) e trata dados corrompidos, então a migração
  para um carrinho de servidor não quebra quem tiver dados antigos no navegador;
- `config.js` centraliza o que um futuro painel administrativo passaria a editar.
