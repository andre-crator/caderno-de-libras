// Agenda de revisão (caixas de Leitner), igual à do protótipo validado com ela.
// Funções puras: recebem "agora" para serem fáceis de testar.

/** Dias até a próxima revisão para cada nível (0 a 5). */
export const INTERVALOS_DIAS = [0, 1, 2, 4, 8, 16] as const;
export const NIVEL_MAXIMO = INTERVALOS_DIAS.length - 1;

export type Resposta = "errei" | "duvida" | "acertei";

/** Brasília não tem horário de verão desde 2019: UTC−3 o ano todo. */
const FUSO_BRASILIA_MS = -3 * 60 * 60 * 1000;
const DIA_MS = 24 * 60 * 60 * 1000;

/**
 * Início do dia (meia-noite em Brasília) daqui a `dias` dias.
 * Usar o início do dia faz o cartão "vencer" logo de manhã, e não na mesma
 * hora em que ela revisou na véspera.
 */
export function inicioDoDiaEmBrasilia(agora: Date, dias: number): Date {
  const local = agora.getTime() + FUSO_BRASILIA_MS;
  const meiaNoiteLocal = Math.floor(local / DIA_MS) * DIA_MS;
  return new Date(meiaNoiteLocal + dias * DIA_MS - FUSO_BRASILIA_MS);
}

export function limitarNivel(nivel: number): number {
  if (!Number.isFinite(nivel)) return 0;
  return Math.min(NIVEL_MAXIMO, Math.max(0, Math.trunc(nivel)));
}

/**
 * Próximo nível e próxima data depois de uma resposta.
 * - errei: volta ao nível 0 e fica para hoje mesmo (aparece de novo na sessão).
 * - duvida: fica no nível atual (mínimo 1) e volta amanhã.
 * - acertei: sobe um nível; volta depois do intervalo desse nível.
 */
export function proximaRevisao(
  nivelAtual: number,
  resposta: Resposta,
  agora: Date,
): { nivel: number; proximaEm: Date } {
  const nivel = limitarNivel(nivelAtual);
  if (resposta === "errei") return { nivel: 0, proximaEm: agora };
  if (resposta === "duvida") {
    return { nivel: Math.max(1, nivel), proximaEm: inicioDoDiaEmBrasilia(agora, 1) };
  }
  const novo = Math.min(NIVEL_MAXIMO, nivel + 1);
  return { nivel: novo, proximaEm: inicioDoDiaEmBrasilia(agora, INTERVALOS_DIAS[novo]) };
}

/** O cartão está para revisar? */
export function estaVencido(proximaEm: Date, agora: Date): boolean {
  return proximaEm.getTime() <= agora.getTime();
}
