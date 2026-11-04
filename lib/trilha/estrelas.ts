// Trilha de estrelas (jogo 1): cada aula é uma parada com até 3 estrelas, calculadas
// só com o que o app já guarda (sem tabela nova):
//   ★ assistiu: aula marcada como concluída;
//   ★ praticou: 3 sinais guardados do tema da aula (ou da unidade, se a aula não tem lista);
//   ★ fixou: 3 desses sinais com nível ≥ 2 na revisão (ela lembrou mais de uma vez).
// Nenhuma parada é trancada: ela segue o curso de verdade (pode já ter tido a aula) e a
// trilha só mostra o avanço.
import type { Aula } from "@/lib/aulas/conteudo";
import { rotuloUnidade } from "@/lib/curso/unidades";
import { normalizarPalavra, VOCABULARIO } from "@/lib/curso/vocabulario";

export const SINAIS_PARA_ESTRELA = 3;
export const NIVEL_FIXADO = 2;

export type SinalResumo = { word: string; category: string | null; lesson: string | null; review_level: number };

export type Parada = {
  aula: Aula;
  estrelas: { assistiu: boolean; praticou: boolean; fixou: boolean };
  total: number;
  /** Quantos sinais do tema/unidade ela já guardou (para "faltam N"). */
  guardados: number;
};

/** Sinais que contam para a aula: palavras das listas dela ou, sem lista, os da unidade. */
export function sinaisDaAula(aula: Aula, sinais: readonly SinalResumo[]): SinalResumo[] {
  if (aula.temas.length > 0) {
    const palavras = new Set(aula.temas.flatMap((t) => VOCABULARIO[t] ?? []).map(normalizarPalavra));
    const temas = new Set(aula.temas);
    return sinais.filter((s) => palavras.has(normalizarPalavra(s.word)) || (s.category && temas.has(s.category)));
  }
  const unidade = rotuloUnidade(aula.unidade);
  return sinais.filter((s) => s.lesson === unidade);
}

export function montarTrilha(aulas: readonly Aula[], feitas: ReadonlySet<string>, sinais: readonly SinalResumo[]): Parada[] {
  return aulas.map((aula) => {
    const daAula = sinaisDaAula(aula, sinais);
    const estrelas = {
      assistiu: feitas.has(aula.slug),
      praticou: daAula.length >= SINAIS_PARA_ESTRELA,
      fixou: daAula.filter((s) => s.review_level >= NIVEL_FIXADO).length >= SINAIS_PARA_ESTRELA,
    };
    const total = Number(estrelas.assistiu) + Number(estrelas.praticou) + Number(estrelas.fixou);
    return { aula, estrelas, total, guardados: daAula.length };
  });
}

/**
 * "Você está aqui": a parada logo depois da última aula concluída (ou a primeira, se
 * nenhuma foi concluída) que ainda não tem as 3 estrelas.
 */
export function paradaAtual(trilha: readonly Parada[]): Parada | null {
  let ultima = -1;
  trilha.forEach((p, i) => {
    if (p.estrelas.assistiu) ultima = i;
  });
  const depois = trilha.slice(ultima + 1).find((p) => p.total < 3);
  return depois ?? trilha.find((p) => p.total < 3) ?? null;
}
