// Fila da sessão de revisão (pura, testável). Regras do protótipo validado com ela.

export const LIMITE_POR_SESSAO = 20; // ~10 a 15 minutos, como ela pediu

export type ItemRevisao = {
  id: string;
  review_level: number;
  review_due_at: string;
  media_url: string | null;
};

export type ModoRevisao = "palavra" | "sinal";

/** Vencidos primeiro (mais atrasados e de nível mais baixo antes), até o limite. */
export function montarFila<T extends ItemRevisao>(
  itens: readonly T[],
  agora: Date,
  opcoes: { modo: ModoRevisao; todos?: boolean; limite?: number; aleatorio?: () => number } = { modo: "palavra" },
): T[] {
  const { modo, todos = false, limite = LIMITE_POR_SESSAO, aleatorio = Math.random } = opcoes;
  // No modo "sinal → palavra" só entram cartões com foto ou vídeo.
  let base = itens.filter((i) => modo === "palavra" || i.media_url);
  if (!todos) {
    base = base
      .filter((i) => new Date(i.review_due_at).getTime() <= agora.getTime())
      .sort(
        (a, b) =>
          new Date(a.review_due_at).getTime() - new Date(b.review_due_at).getTime() || a.review_level - b.review_level,
      );
    return base.slice(0, limite);
  }
  // Treino livre: embaralha tudo.
  const copia = [...base];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia.slice(0, limite);
}

/** Quantos cartões estão para revisar agora. */
export function contarVencidos(itens: readonly Pick<ItemRevisao, "review_due_at">[], agora: Date): number {
  return itens.filter((i) => new Date(i.review_due_at).getTime() <= agora.getTime()).length;
}

/** Depois de "errei", o cartão volta no fim da sessão (o componente garante que volta uma vez só). */
export function reenfileirar<T extends { id: string }>(fila: readonly T[], posicao: number): T[] {
  const item = fila[posicao];
  if (!item) return [...fila];
  return [...fila, item];
}
