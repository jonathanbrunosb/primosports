/* =========================================================================
   Persistência local (localStorage)
   Usado apenas para: carrinho de orçamento e favoritos.
   Nenhum dado pessoal é gravado no navegador.
   ========================================================================= */

const STORAGE_VERSION = 1;
const STORAGE_KEYS = {
  cart: 'primos.cart',
  favorites: 'primos.favorites'
};

/** localStorage pode estar indisponível (modo privado, cota cheia, iframe). */
function storageAvailable() {
  try {
    const k = '__primos_test__';
    window.localStorage.setItem(k, '1');
    window.localStorage.removeItem(k);
    return true;
  } catch (_) {
    return false;
  }
}

const HAS_STORAGE = storageAvailable();

/** Envelope padrão com versão de schema. */
function wrap(items) {
  return { version: STORAGE_VERSION, updatedAt: new Date().toISOString(), items };
}

/**
 * Lê uma coleção. Retorna [] em qualquer cenário de falha:
 * dados corrompidos, schema antigo ou storage indisponível.
 */
function readCollection(key) {
  if (!HAS_STORAGE) return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== STORAGE_VERSION || !Array.isArray(parsed.items)) {
      window.localStorage.removeItem(key); // limpeza segura de schema antigo/corrompido
      return [];
    }
    return parsed.items;
  } catch (_) {
    try { window.localStorage.removeItem(key); } catch (__) { /* ignora */ }
    return [];
  }
}

/** Grava uma coleção. Retorna false se não foi possível persistir. */
function writeCollection(key, items) {
  if (!HAS_STORAGE) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(wrap(items)));
    return true;
  } catch (_) {
    return false; // cota excedida — a sessão continua funcionando em memória
  }
}
