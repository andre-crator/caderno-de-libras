// O que a tela inicial sugere fazer agora (puro, testável). Ordem de prioridade:
// revisar o que venceu (não deixar esquecer) > continuar as aulas > guardar o 1º sinal > treinar.
import { AULAS, type Aula } from "@/lib/aulas/conteudo";
import { rotuloUnidade } from "@/lib/curso/unidades";
import { LIMITE_POR_SESSAO } from "@/lib/revisao/fila";

export type Sugestao = { titulo: string; detalhe: string; href: string; botao: string };

export function proximaAula(feitas: ReadonlySet<string>): Aula | null {
  return AULAS.find((a) => !feitas.has(a.slug)) ?? null;
}

/** Uns 30 segundos por cartão, no máximo uma sessão. */
export function minutosDeRevisao(cartoes: number): number {
  return Math.max(1, Math.ceil((Math.min(cartoes, LIMITE_POR_SESSAO) * 30) / 60));
}

export function sugestaoDeAgora(r: { vencidos: number; sinais: number; feitas: ReadonlySet<string> }): Sugestao {
  if (r.vencidos > 0) {
    const n = r.vencidos;
    return {
      titulo: `${n} ${n === 1 ? "sinal" : "sinais"} para revisar`,
      detalhe: `Leva uns ${minutosDeRevisao(n)} min. Revisar no dia certo é o que faz não esquecer.`,
      href: "/revisar",
      botao: "Revisar agora",
    };
  }
  const aula = proximaAula(r.feitas);
  if (aula) {
    return {
      titulo: r.feitas.size === 0 ? `Comece pela aula “${aula.titulo}”` : `Continue: ${aula.titulo}`,
      detalhe: `${rotuloUnidade(aula.unidade)} · ${aula.objetivo}`,
      href: `/aulas/${aula.slug}`,
      botao: r.feitas.size === 0 ? "Começar a aula" : "Continuar a aula",
    };
  }
  if (r.sinais === 0) {
    return {
      titulo: "Guarde seu primeiro sinal",
      detalhe: "Fotografe ou grave um sinal da aula para começar a revisar.",
      href: "/caderno/novo",
      botao: "Guardar sinal",
    };
  }
  return {
    titulo: "Tudo em dia!",
    detalhe: "Nenhuma revisão pendente. Que tal treinar o alfabeto manual?",
    href: "/soletrar",
    botao: "Treinar soletrar",
  };
}

export type Passo = { texto: string; feito: boolean; href: string };

/** "Primeiros passos" para quem está começando; some quando os três estão feitos. */
export function primeirosPassos(r: { aulasFeitas: number; sinais: number; revisados: number }): Passo[] {
  return [
    { texto: "Assista à primeira aula", feito: r.aulasFeitas > 0, href: "/aulas" },
    { texto: "Guarde seu primeiro sinal no caderno", feito: r.sinais > 0, href: "/caderno/novo" },
    { texto: "Faça sua primeira revisão", feito: r.revisados > 0, href: "/revisar" },
  ];
}

/** Bom dia / Boa tarde / Boa noite pelo horário de Brasília. */
export function saudacao(agora: Date): string {
  const hora = Number(
    new Intl.DateTimeFormat("pt-BR", { hour: "numeric", hour12: false, timeZone: "America/Sao_Paulo" }).format(agora),
  );
  if (hora >= 5 && hora < 12) return "Bom dia";
  if (hora >= 12 && hora < 18) return "Boa tarde";
  return "Boa noite";
}

/** Primeiro nome para a saudação ("Laize Santos" → "Laize"); vazio se não houver. */
export function primeiroNome(nome: string | null | undefined): string {
  return (nome ?? "").trim().split(/\s+/)[0] ?? "";
}

/** "terça-feira, 4 de novembro" → "Terça-feira, 4 de novembro" (horário de Brasília). */
export function dataDeHoje(agora: Date): string {
  const t = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "America/Sao_Paulo",
  }).format(agora);
  return t.charAt(0).toLocaleUpperCase("pt-BR") + t.slice(1);
}
