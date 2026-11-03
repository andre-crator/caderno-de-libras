// Roteiro do curso básico que ela faz: só a SEQUÊNCIA de unidades e temas, para
// organizar o caderno na ordem das aulas (D6). Nenhum texto ou imagem da apostila
// entra no app: o conteúdo de cada sinal vem do que ela anota, fotografa ou grava.

export type Unidade = {
  numero: number;
  temas: readonly string[];
};

export const UNIDADES: readonly Unidade[] = [
  { numero: 1, temas: ["História da educação de surdos", "Quem são os surdos", "Lei da Libras (10.436/2002)", "Surdez"] },
  { numero: 2, temas: ["Parâmetros", "Alfabeto manual", "Aspectos linguísticos", "Pronomes", "Saudações", "Cumprimentos", "Números"] },
  { numero: 3, temas: ["Tempo e clima", "Advérbios de tempo", "Expressões faciais", "Tipos de frases"] },
  { numero: 4, temas: ["Família", "Verbo ser/estar", "Verbo ir", "Sentimentos"] },
  { numero: 5, temas: ["Dinheiro", "Horas e duração", "Sinais operacionais"] },
  { numero: 6, temas: ["Cores", "Adjetivos"] },
  { numero: 7, temas: ["Material escolar", "Meios de transporte", "Meios de comunicação"] },
  { numero: 8, temas: ["Estados brasileiros"] },
  { numero: 9, temas: ["Alimentos"] },
  { numero: 10, temas: ["Advérbios de frequência", "Profissões"] },
  { numero: 11, temas: ["Pronomes indefinidos e qualificadores"] },
  { numero: 12, temas: ["Animais", "Saúde"] },
];

/** Rótulo curto para a aula/unidade no caderno, ex.: "Unidade 4". */
export function rotuloUnidade(numero: number): string {
  return `Unidade ${numero}`;
}

/** Todos os temas, na ordem do curso, para sugerir categorias no cadastro. */
export function temasEmOrdem(): string[] {
  return UNIDADES.flatMap((u) => u.temas);
}

/** Em que unidade um tema aparece (ou null se for um tema criado por ela). */
export function unidadeDoTema(tema: string): number | null {
  const alvo = tema.trim().toLocaleLowerCase("pt-BR");
  const u = UNIDADES.find((x) => x.temas.some((t) => t.toLocaleLowerCase("pt-BR") === alvo));
  return u ? u.numero : null;
}
