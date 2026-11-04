// Jogo da memória (jogo 2, puro e testável): pares "mídia do caderno ↔ palavra".
// Só usa sinais com foto ou vídeo dela; palavras repetidas viram um par só.
import { embaralhar, type ItemQuiz } from "@/lib/revisao/quiz";

export const PARES_POR_JOGO = 6;
export const PARES_MINIMOS = 3;
/** Errou o par 2 vezes ou mais: ele aparece no fim como "difícil" (ela decide mandar para a revisão). */
export const ERROS_PARA_DIFICIL = 2;

export type Carta<T extends ItemQuiz> = { chave: string; item: T; lado: "midia" | "palavra" };

const chave = (p: string) => p.trim().toLocaleLowerCase("pt-BR");

function paresPossiveis<T extends ItemQuiz>(itens: readonly T[]): T[] {
  const vistas = new Set<string>();
  return itens.filter((i) => {
    const k = chave(i.word);
    if (!i.media_url || vistas.has(k)) return false;
    vistas.add(k);
    return true;
  });
}

export function podeJogarMemoria(itens: readonly ItemQuiz[]): boolean {
  return paresPossiveis(itens).length >= PARES_MINIMOS;
}

export function montarMemoria<T extends ItemQuiz>(
  itens: readonly T[],
  aleatorio: () => number = Math.random,
  pares = PARES_POR_JOGO,
): Carta<T>[] {
  const escolhidos = embaralhar(paresPossiveis(itens), aleatorio).slice(0, pares);
  if (escolhidos.length < PARES_MINIMOS) return [];
  const cartas = escolhidos.flatMap((item): Carta<T>[] => [
    { chave: `${item.id}:m`, item, lado: "midia" },
    { chave: `${item.id}:p`, item, lado: "palavra" },
  ]);
  return embaralhar(cartas, aleatorio);
}

/** Duas cartas viradas formam par? (mesmo sinal, lados diferentes) */
export function formamPar(a: Carta<ItemQuiz>, b: Carta<ItemQuiz>): boolean {
  return a.item.id === b.item.id && a.lado !== b.lado;
}

/** Ids dos sinais que ela errou 2 vezes ou mais. */
export function paresDificeis(errosPorSinal: Readonly<Record<string, number>>): string[] {
  return Object.entries(errosPorSinal)
    .filter(([, n]) => n >= ERROS_PARA_DIFICIL)
    .map(([id]) => id);
}

/** "1:05" */
export function formatarTempo(segundos: number): string {
  const s = Math.max(0, Math.floor(segundos));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
