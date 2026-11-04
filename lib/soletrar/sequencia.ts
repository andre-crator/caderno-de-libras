// Regras do treino de datilologia (alfabeto manual) e de números.
// Funções puras; o sorteio recebe a função aleatória para poder ser testado.

export type Modo = "letras" | "numeros";

/** Palavras curtas para sortear no treino do alfabeto (só texto em português). */
export const PALAVRAS = [
  "CASA", "AMOR", "ESCOLA", "LIBRAS", "SURDO", "FAMÍLIA", "ÁGUA", "CAFÉ", "AMIGO", "FELIZ",
  "JANELA", "CACHORRO", "GATO", "LIVRO", "PRAIA", "BRASIL", "VERDE", "QUEIJO", "ZEBRA",
  "XÍCARA", "KIWI", "YOGA", "HORA", "PÃO", "MAÇÃ", "WIFI", "INCLUIR", "OBRIGADA", "BOLO",
] as const;

/** Faixas de números para o treino, da mais fácil à mais difícil. */
export const FAIXAS = [
  { id: "0-9", rotulo: "0 a 9", min: 0, max: 9 },
  { id: "10-99", rotulo: "10 a 99", min: 10, max: 99 },
  { id: "100-999", rotulo: "100 a 999", min: 100, max: 999 },
  { id: "telefone", rotulo: "Telefone", min: 900000000, max: 999999999 },
] as const;

/** Números do dia a dia (unidade 5 da ementa): mostrados em grupos, como se fala. */
export const CONTEXTOS = [
  { id: "data", rotulo: "Data" },
  { id: "hora", rotulo: "Hora" },
  { id: "dinheiro", rotulo: "Dinheiro" },
] as const;

export type FaixaId = (typeof FAIXAS)[number]["id"] | (typeof CONTEXTOS)[number]["id"];

/**
 * Itens mostrados um a um: letras (com acento, em maiúscula) ou números.
 * Número "solto" (telefone, código) vai dígito por dígito; data, hora e dinheiro
 * ("25/12", "14:30", "R$ 7,50") vão em grupos, como se diz: 25, 12.
 */
export function itensParaSoletrar(texto: string, modo: Modo): string[] {
  if (modo === "letras") return [...texto.toLocaleUpperCase("pt-BR")].filter((c) => /\p{L}/u.test(c));
  if (/[/:,]|R\$/.test(texto)) return texto.match(/\d+/g) ?? [];
  return [...texto].filter((c) => /\d/.test(c));
}

export function sortearPalavra(extras: readonly string[] = [], aleatorio: () => number = Math.random): string {
  const validas = extras
    .map((p) => p.trim().toLocaleUpperCase("pt-BR"))
    .filter((p) => !/\s/.test(p) && itensParaSoletrar(p, "letras").length >= 2 && p.length <= 12);
  const todas = [...PALAVRAS, ...validas];
  return todas[Math.floor(aleatorio() * todas.length) % todas.length];
}

const doisDigitos = (n: number) => String(n).padStart(2, "0");

export function sortearNumero(faixa: FaixaId, aleatorio: () => number = Math.random): string {
  const entre = (min: number, max: number) => Math.min(max, min + Math.floor(aleatorio() * (max - min + 1)));
  if (faixa === "data") return `${doisDigitos(entre(1, 28))}/${doisDigitos(entre(1, 12))}`;
  if (faixa === "hora") return `${doisDigitos(entre(0, 23))}:${doisDigitos(entre(0, 11) * 5)}`;
  if (faixa === "dinheiro") return `R$ ${entre(1, 199)},${doisDigitos(entre(0, 19) * 5)}`;
  const f = FAIXAS.find((x) => x.id === faixa) ?? FAIXAS[0];
  const n = f.min + Math.floor(aleatorio() * (f.max - f.min + 1));
  return String(Math.min(n, f.max));
}

/** Tempo por item: entre 0,5 e 2,5 segundos. */
export function limitarTempo(segundos: number): number {
  if (!Number.isFinite(segundos)) return 1.2;
  return Math.min(2.5, Math.max(0.5, Math.round(segundos * 10) / 10));
}
