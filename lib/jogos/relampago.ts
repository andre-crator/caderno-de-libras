// Sinal relâmpago (jogo 3, puro e testável): o vídeo do caderno começa em 0,5× e fica
// mais rápido a cada 5 acertos, até o normal e um pouco além (como uma conversa de
// verdade). 3 opções, 3 vidas, combo e recorde. Só vídeos: foto não tem velocidade.
import { embaralhar } from "@/lib/revisao/quiz";

export const VIDAS = 3;
export const OPCOES_RELAMPAGO = 3;
export const ACERTOS_POR_NIVEL = 5;
export const VELOCIDADES = [0.5, 0.75, 1, 1.25, 1.5] as const;
export const VIDEOS_MINIMOS = 3;

export function velocidadeDe(acertos: number): number {
  const nivel = Math.floor(Math.max(0, acertos) / ACERTOS_POR_NIVEL);
  return VELOCIDADES[Math.min(nivel, VELOCIDADES.length - 1)];
}

/** Pontos de um acerto: 10 × velocidade, mais 5 por acerto seguido (combo) a partir do 2º. */
export function pontosDoAcerto(velocidade: number, combo: number): number {
  return Math.round(10 * velocidade) + 5 * Math.max(0, combo - 1);
}

/** "0,5×", "Normal", "1,25×" */
export function rotuloVelocidade(v: number): string {
  return v === 1 ? "Normal" : `${String(v).replace(".", ",")}×`;
}

const CHAVE_RECORDE = "incluir:recorde-relampago";

/** Recorde guardado só neste celular (conveniência; some se limpar os dados do app). */
export function lerRecorde(): number {
  try {
    const n = Number(localStorage.getItem(CHAVE_RECORDE));
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  } catch {
    return 0;
  }
}

export function salvarRecorde(pontos: number): void {
  try {
    localStorage.setItem(CHAVE_RECORDE, String(Math.floor(pontos)));
  } catch {
    /* sem armazenamento: o recorde só vale nesta partida */
  }
}

export type ItemRelampago = { id: string; word: string; category: string | null };

const chave = (p: string) => p.trim().toLocaleLowerCase("pt-BR");

/** Palavras diferentes que dá para usar como opção. */
export function palavrasDiferentes(itens: readonly ItemRelampago[]): number {
  return new Set(itens.map((i) => chave(i.word))).size;
}

export function podeJogarRelampago(videos: readonly ItemRelampago[], todos: readonly ItemRelampago[]): boolean {
  return palavrasDiferentes(videos) >= VIDEOS_MINIMOS && palavrasDiferentes(todos) >= OPCOES_RELAMPAGO;
}

/**
 * Sorteia o próximo vídeo (sem repetir o anterior, se der) e 3 opções: a certa e
 * erradas de preferência do mesmo tema.
 */
export function proximaPergunta<T extends ItemRelampago>(
  videos: readonly T[],
  todos: readonly ItemRelampago[],
  anteriorId: string | null,
  aleatorio: () => number = Math.random,
): { item: T; opcoes: string[] } | null {
  const candidatos = videos.length > 1 ? videos.filter((v) => v.id !== anteriorId) : videos;
  if (!candidatos.length) return null;
  const item = candidatos[Math.floor(aleatorio() * candidatos.length)];
  const vistas = new Set([chave(item.word)]);
  const embaralhados = embaralhar(todos, aleatorio);
  const mesmoTema = embaralhados.filter((o) => o.category && o.category === item.category);
  const erradas: string[] = [];
  for (const o of [...mesmoTema, ...embaralhados]) {
    if (erradas.length >= OPCOES_RELAMPAGO - 1) break;
    const k = chave(o.word);
    if (vistas.has(k)) continue;
    vistas.add(k);
    erradas.push(o.word);
  }
  const opcoes = embaralhar([item.word, ...erradas], aleatorio);
  return { item, opcoes };
}
