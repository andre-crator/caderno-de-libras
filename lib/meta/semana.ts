// Meta da semana (puro e testável). Semana = segunda a domingo, em Brasília.
// Os dias chegam do banco como "AAAA-MM-DD" (data de Brasília).
import { inicioDaSemana } from "@/lib/jogos/caca";

export const METAS = [2, 3, 4, 5] as const;
export const META_PADRAO = 3;
export const LETRAS_DIAS = ["S", "T", "Q", "Q", "S", "S", "D"] as const;
const DIA_MS = 24 * 60 * 60 * 1000;
const FUSO_MS = 3 * 60 * 60 * 1000;

/** "AAAA-MM-DD" do dia em Brasília. */
export function diaEmBrasilia(d: Date): string {
  return new Date(d.getTime() - FUSO_MS).toISOString().slice(0, 10);
}

/** Segunda-feira ("AAAA-MM-DD") da semana do dia dado. */
function segundaDe(dia: string): string {
  const d = new Date(`${dia}T12:00:00Z`);
  const desde = (d.getUTCDay() + 6) % 7;
  return new Date(d.getTime() - desde * DIA_MS).toISOString().slice(0, 10);
}

export function limitarMeta(n: number): number {
  return Number.isInteger(n) && n >= 1 && n <= 7 ? n : META_PADRAO;
}

export type Semana = {
  /** Segunda a domingo: estudou? */
  dias: boolean[];
  /** Índice de hoje (0 = segunda). */
  hoje: number;
  feitos: number;
  meta: number;
  cumpriu: boolean;
  /** Semanas seguidas com a meta cumprida (conta a atual só se já cumpriu). */
  sequencia: number;
};

export function resumoDaSemana(diasEstudados: readonly string[], metaBruta: number, agora: Date): Semana {
  const meta = limitarMeta(metaBruta);
  const segunda = diaEmBrasilia(inicioDaSemana(agora));
  const hoje = Math.round((new Date(`${diaEmBrasilia(agora)}T12:00:00Z`).getTime() - new Date(`${segunda}T12:00:00Z`).getTime()) / DIA_MS);
  const conjunto = new Set(diasEstudados);
  const dias = Array.from({ length: 7 }, (_, i) =>
    conjunto.has(new Date(new Date(`${segunda}T12:00:00Z`).getTime() + i * DIA_MS).toISOString().slice(0, 10)),
  );
  const feitos = dias.filter(Boolean).length;
  const cumpriu = feitos >= meta;

  // Dias por semana (chave = segunda-feira).
  const porSemana = new Map<string, number>();
  for (const d of conjunto) porSemana.set(segundaDe(d), (porSemana.get(segundaDe(d)) ?? 0) + 1);
  let sequencia = cumpriu ? 1 : 0;
  let s = new Date(`${segunda}T12:00:00Z`).getTime() - 7 * DIA_MS;
  while ((porSemana.get(new Date(s).toISOString().slice(0, 10)) ?? 0) >= meta) {
    sequencia++;
    s -= 7 * DIA_MS;
  }
  return { dias, hoje, feitos, meta, cumpriu, sequencia };
}

export type ItemLembrete = { vencidos: number; estudou_hoje: boolean; dias_na_semana: number; meta: number };
export type Mensagem = { titulo: string; texto: string; url: string };

/** O que o lembrete diz (ou null = não mandar nada hoje). Nunca cobra: só convida. */
export function mensagemDoLembrete(i: ItemLembrete): Mensagem | null {
  if (i.estudou_hoje) return null;
  if (i.vencidos > 0) {
    return {
      titulo: "Hora de revisar",
      texto:
        i.vencidos === 1
          ? "Você tem 1 sinal para revisar. Leva menos de 1 minuto."
          : `Você tem ${i.vencidos} sinais para revisar. Leva uns ${Math.min(10, Math.max(2, Math.ceil(i.vencidos / 4)))} minutos.`,
      url: "/revisar",
    };
  }
  const faltam = limitarMeta(i.meta) - i.dias_na_semana;
  if (faltam > 0) {
    return {
      titulo: "Que tal 5 minutos de Libras?",
      texto: faltam === 1 ? "Falta 1 dia para a sua meta da semana." : `Faltam ${faltam} dias para a sua meta da semana.`,
      url: "/painel",
    };
  }
  return null;
}
