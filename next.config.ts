import type { NextConfig } from "next";

// Versão do app para o service worker: muda a cada publicação (commit na Vercel;
// local, a hora do build). Ver components/RegistrarSW.tsx e public/sw.js.
const VERSAO_APP = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) || Date.now().toString(36);

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_VERSAO_APP: VERSAO_APP },
  cacheComponents: true,
  partialPrefetching: true,
  async headers() {
    return [
      {
        // Service worker: nunca em cache HTTP, senão o celular demora a pegar a versão nova.
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          // Sem Content-Security-Policy aqui: no service worker ela também vale para os
          // pedidos que ele faz, e bloquearia as fotos do Supabase (outro domínio).
        ],
      },
    ];
  },
};

export default nextConfig;
