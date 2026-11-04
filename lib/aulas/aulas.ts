// Funções puras das aulas: junta textos (conteudo.ts) e vídeos (content/aulas/videos.json).
import dadosVideos from "@/content/aulas/videos.json";
import { AULAS, type Aula } from "./conteudo";

export type VideoAula = {
  id: string;
  aula: string;
  titulo: string;
  canal: string | null;
  conferido: boolean;
};

export const VIDEOS: readonly VideoAula[] = dadosVideos.videos;

/** ID de vídeo do YouTube: 11 caracteres de letras, números, - e _. */
export function idYoutubeValido(id: string): boolean {
  return /^[\w-]{11}$/.test(id);
}

/** Player oficial sem cookies de rastreamento (youtube-nocookie), sem vídeos de outros canais no fim. */
export function urlDoPlayer(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&cc_lang_pref=pt&hl=pt-BR`;
}

export function urlNoYoutube(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

export function miniatura(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

/** Busca no YouTube pelo tema, para quando ela quiser mais vídeos. */
export function buscaNoYoutube(termo: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${termo} em Libras`)}`;
}

export function getAula(slug: string): Aula | null {
  return AULAS.find((a) => a.slug === slug) ?? null;
}

export function videosDaAula(slug: string): VideoAula[] {
  return VIDEOS.filter((v) => v.aula === slug && idYoutubeValido(v.id));
}

export function aulasPorUnidade(): { unidade: number; aulas: Aula[] }[] {
  const mapa = new Map<number, Aula[]>();
  for (const a of AULAS) mapa.set(a.unidade, [...(mapa.get(a.unidade) ?? []), a]);
  return [...mapa.entries()].sort(([x], [y]) => x - y).map(([unidade, aulas]) => ({ unidade, aulas }));
}

/** Aula anterior e próxima, na ordem do curso. */
export function vizinhas(slug: string): { anterior: Aula | null; proxima: Aula | null } {
  const i = AULAS.findIndex((a) => a.slug === slug);
  if (i < 0) return { anterior: null, proxima: null };
  return { anterior: AULAS[i - 1] ?? null, proxima: AULAS[i + 1] ?? null };
}

/** Partes de um texto com **negrito**, para renderizar sem HTML cru. */
export function partesComNegrito(texto: string): { texto: string; negrito: boolean }[] {
  return texto
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((p) => (p.startsWith("**") && p.endsWith("**") ? { texto: p.slice(2, -2), negrito: true } : { texto: p, negrito: false }));
}
