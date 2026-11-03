// Links para ver um sinal em dicionários da internet (D2/D7): o app só leva até
// lá, sem copiar vídeo nem imagem. `confirmado: false` = formato do link ainda não
// testado (a sessão do Claude não acessa esses sites); o André confere no celular.

export type Dicionario = {
  id: "spreadthesign" | "ines";
  nome: string;
  confirmado: boolean;
  /** Link para a palavra, ou para a página de busca quando não há link por palavra. */
  link: (palavra: string) => string;
};

export const DICIONARIOS: readonly Dicionario[] = [
  {
    id: "spreadthesign",
    nome: "Spread The Sign",
    confirmado: false,
    link: (palavra) => `https://www.spreadthesign.com/pt.br/search/?q=${encodeURIComponent(palavra.trim())}`,
  },
  {
    id: "ines",
    nome: "Dicionário do INES",
    confirmado: false,
    // Sem busca por link conhecida: abre o dicionário para ela procurar.
    link: () => "https://www.ines.gov.br/dicionario-de-libras/",
  },
];
