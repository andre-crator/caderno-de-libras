import type { MetadataRoute } from "next";

// Torna o Incluir instalável no Android ("Adicionar à tela inicial").
// Cores iguais às de design/tokens.css (--background e --primary).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Incluir — caderno de Libras",
    short_name: "Incluir",
    description: "Guarde os sinais das aulas, revise e treine o alfabeto manual.",
    lang: "pt-BR",
    start_url: "/painel",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f3f6fc",
    theme_color: "#1f4fd1",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
