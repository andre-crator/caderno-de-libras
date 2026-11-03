"use client";
// Registra o service worker (public/sw.js) só em produção: no `npm run dev` ele
// atrapalharia o recarregamento automático. O "?v=" muda a cada publicação
// (NEXT_PUBLIC_VERSAO_APP, definido no next.config.ts): o celular instala o SW novo
// e apaga os caches antigos.
import { useEffect } from "react";

export function RegistrarSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    const versao = encodeURIComponent(process.env.NEXT_PUBLIC_VERSAO_APP ?? "dev");
    navigator.serviceWorker.register(`/sw.js?v=${versao}`, { scope: "/", updateViaCache: "none" }).catch(() => {
      // Sem service worker o app funciona normal, só não abre offline.
    });
  }, []);
  return null;
}

/** Pede ao service worker para apagar telas e fotos guardadas (ex.: depois de entrar). */
export function limparCacheDaConta() {
  if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
    navigator.serviceWorker.controller?.postMessage("limpar");
  }
}
