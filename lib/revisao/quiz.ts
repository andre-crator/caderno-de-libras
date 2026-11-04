// Quiz "que sinal é este?" (puro, testável): mostra a mídia de um sinal dela e 4
// palavras. As erradas vêm de preferência do mesmo tema, para não ficar fácil demais.

export const OPCOES_POR_PERGUNTA = 4;
export const PERGUNTAS_POR_QUIZ = 10;

export type ItemQuiz = { id: string; word: string; category: string | null; media_url: string | null };
export type Pergunta<T extends ItemQuiz> = { item: T; opcoes: string[] };

function embaralhar<T>(lista: readonly T[], aleatorio: () => number): T[] {
  const c = [...lista];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

const chave = (p: string) => p.trim().toLocaleLowerCase("pt-BR");

/** Dá para montar o quiz? Precisa de 1 sinal com mídia e 4 palavras diferentes no total. */
export function podeFazerQuiz(itens: readonly ItemQuiz[]): boolean {
  const palavras = new Set(itens.map((i) => chave(i.word)));
  return itens.some((i) => i.media_url) && palavras.size >= OPCOES_POR_PERGUNTA;
}

export function montarQuiz<T extends ItemQuiz>(
  itens: readonly T[],
  aleatorio: () => number = Math.random,
  quantas = PERGUNTAS_POR_QUIZ,
): Pergunta<T>[] {
  if (!podeFazerQuiz(itens)) return [];
  const comMidia = embaralhar(
    itens.filter((i) => i.media_url),
    aleatorio,
  ).slice(0, quantas);

  return comMidia.map((item) => {
    const vistas = new Set([chave(item.word)]);
    const unicas = (lista: readonly T[]) =>
      lista.filter((o) => {
        const k = chave(o.word);
        if (vistas.has(k)) return false;
        vistas.add(k);
        return true;
      });
    const mesmoTema = unicas(embaralhar(itens.filter((o) => o.category && o.category === item.category), aleatorio));
    const outros = unicas(embaralhar(itens, aleatorio));
    const erradas = [...mesmoTema, ...outros].slice(0, OPCOES_POR_PERGUNTA - 1).map((o) => o.word);
    return { item, opcoes: embaralhar([item.word, ...erradas], aleatorio) };
  });
}
