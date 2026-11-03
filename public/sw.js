/*
 * Service worker do Incluir (parte 6 — offline básico).
 * - Telas (navegação): internet primeiro; sem internet, a última versão guardada;
 *   se nunca foi aberta, a tela /offline.
 * - Privacidade: cada resposta traz "x-incluir-conta" (marca da conta, do proxy). Se a
 *   conta mudar, as telas e fotos guardadas são apagadas antes de guardar as novas.
 *   O login também pede para limpar ("limpar"), e /auth/signout manda Clear-Site-Data.
 * - Arquivos do app (/_next/static): guardados (têm hash no nome).
 * - Fotos dos sinais (URL assinada do Supabase): pedidas com CORS e guardadas só se
 *   vierem certas, pelo caminho sem o token (a URL muda, o arquivo não).
 * - Vídeos, Server Actions e dados do Next (RSC): só com internet.
 * A versão vem do endereço de registro (/sw.js?v=...), que muda a cada publicação:
 * o navegador instala o SW novo e os caches da versão antiga são apagados.
 */
const VERSAO = "incluir-" + (new URL(self.location.href).searchParams.get("v") || "dev");
const CACHE_APP = `${VERSAO}-app`;
const CACHE_TELAS = `${VERSAO}-telas`;
const CACHE_FOTOS = `${VERSAO}-fotos`;
const CHAVE_CONTA = "/__incluir-conta__";
const PRE_CACHE = ["/offline", "/soletrar", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon.svg"];
const NUNCA_GUARDAR = ["/auth/", "/login", "/sw.js", "/offline"];
const MAX_TELAS = 80;
const MAX_FOTOS = 300;
const ESTATICO = /\/_next\/static\/[^"'\s)\\]+/g;

/** Guarda as páginas básicas e todos os arquivos /_next/static que elas citam (CSS, JS, fontes). */
async function preCache() {
  const cache = await caches.open(CACHE_APP);
  await cache.addAll(PRE_CACHE);
  const pendentes = [];
  for (const pagina of ["/offline", "/soletrar"]) {
    const resposta = await cache.match(pagina);
    if (resposta) pendentes.push(await resposta.clone().text());
  }
  const vistos = new Set();
  while (pendentes.length) {
    const texto = pendentes.pop();
    for (const caminho of texto.match(ESTATICO) || []) {
      if (vistos.has(caminho)) continue;
      vistos.add(caminho);
      try {
        const resposta = await fetch(caminho);
        if (!resposta.ok) continue;
        await cache.put(caminho, resposta.clone());
        // CSS cita fontes (url(/_next/static/media/...)): segue as referências.
        if (caminho.endsWith(".css")) pendentes.push(await resposta.text());
      } catch {
        /* sem internet na instalação: segue com o que deu */
      }
    }
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(preCache().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((nomes) => Promise.all(nomes.filter((n) => !n.startsWith(VERSAO + "-")).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  );
});

async function limparDadosDaConta() {
  await Promise.all([caches.delete(CACHE_TELAS), caches.delete(CACHE_FOTOS)]);
}

self.addEventListener("message", (event) => {
  if (event.data === "limpar") event.waitUntil(limparDadosDaConta());
});

/** Se a resposta é de outra conta, apaga o que estava guardado. Devolve a marca. */
async function conferirConta(resposta) {
  const conta = resposta.headers.get("x-incluir-conta");
  if (!conta) return null;
  const app = await caches.open(CACHE_APP);
  const anterior = await app.match(CHAVE_CONTA);
  const marcaAnterior = anterior ? await anterior.text() : null;
  if (marcaAnterior !== conta) {
    await limparDadosDaConta();
    await app.put(CHAVE_CONTA, new Response(conta));
  }
  return conta;
}

async function limitar(nomeCache, max) {
  const cache = await caches.open(nomeCache);
  const chaves = await cache.keys();
  for (let i = 0; i < chaves.length - max; i++) await cache.delete(chaves[i]);
}

function guardarDepois(event, promessa) {
  event.waitUntil(promessa.catch(() => {})); // cota cheia etc.: só não guarda
}

async function tela(event) {
  const { request } = event;
  const url = new URL(request.url);
  const chave = url.pathname + url.search;
  try {
    const resposta = await fetch(request);
    const conta = await conferirConta(resposta);
    const guardavel =
      resposta.ok &&
      !resposta.redirected &&
      conta !== null &&
      (resposta.headers.get("content-type") || "").includes("text/html") &&
      !NUNCA_GUARDAR.some((p) => url.pathname.startsWith(p));
    if (guardavel) {
      const copia = resposta.clone();
      guardarDepois(
        event,
        caches
          .open(CACHE_TELAS)
          .then((c) => c.put(chave, copia))
          .then(() => limitar(CACHE_TELAS, MAX_TELAS)),
      );
    }
    return resposta;
  } catch {
    return (
      (await caches.match(chave, { cacheName: CACHE_TELAS })) ||
      (await caches.match(url.pathname, { cacheName: CACHE_TELAS })) ||
      (await caches.match(url.pathname, { cacheName: CACHE_APP })) ||
      (await caches.match("/offline", { cacheName: CACHE_APP })) ||
      Response.error()
    );
  }
}

async function estatico(event) {
  const guardado = await caches.match(event.request, { cacheName: CACHE_APP });
  if (guardado) return guardado;
  const resposta = await fetch(event.request);
  if (resposta.ok) {
    const copia = resposta.clone();
    guardarDepois(event, caches.open(CACHE_APP).then((c) => c.put(event.request, copia)));
  }
  return resposta;
}

/** Ícones e manifesto: internet primeiro (podem mudar), guardado se estiver sem internet. */
async function redePrimeiro(event) {
  try {
    const resposta = await fetch(event.request);
    if (resposta.ok) {
      const copia = resposta.clone();
      guardarDepois(event, caches.open(CACHE_APP).then((c) => c.put(event.request, copia)));
    }
    return resposta;
  } catch {
    return (await caches.match(event.request, { cacheName: CACHE_APP })) || Response.error();
  }
}

async function foto(event) {
  const url = new URL(event.request.url);
  const chave = url.origin + url.pathname; // sem o token
  try {
    // CORS (o Storage do Supabase permite): resposta legível, guardada só se der certo.
    const resposta = await fetch(event.request.url, { mode: "cors", credentials: "omit" });
    if (resposta.ok) {
      const copia = resposta.clone();
      guardarDepois(
        event,
        caches
          .open(CACHE_FOTOS)
          .then((c) => c.put(chave, copia))
          .then(() => limitar(CACHE_FOTOS, MAX_FOTOS)),
      );
      return resposta;
    }
    return (await caches.match(chave, { cacheName: CACHE_FOTOS })) || resposta;
  } catch {
    return (await caches.match(chave, { cacheName: CACHE_FOTOS })) || Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return; // Server Actions e envios: só com internet
  const url = new URL(request.url);

  if (request.mode === "navigate") return event.respondWith(tela(event));

  if (url.origin === self.location.origin) {
    if (url.pathname.startsWith("/_next/static/")) return event.respondWith(estatico(event));
    if (url.pathname.startsWith("/icons/") || url.pathname === "/manifest.webmanifest") {
      return event.respondWith(redePrimeiro(event));
    }
    return; // RSC e demais: rede normal (sem internet, o Next recarrega a tela e cai em tela())
  }

  if (request.destination === "image" && url.pathname.includes("/storage/v1/object/sign/sign-media/")) {
    return event.respondWith(foto(event));
  }
});
