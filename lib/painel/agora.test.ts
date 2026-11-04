import { describe, expect, it } from "vitest";
import { AULAS } from "@/lib/aulas/conteudo";
import { dataDeHoje, minutosDeRevisao, primeiroNome, primeirosPassos, proximaAula, saudacao, sugestaoDeAgora } from "./agora";

const nenhuma = new Set<string>();
const todas = new Set(AULAS.map((a) => a.slug));

describe("sugestaoDeAgora", () => {
  it("revisão vencida vem primeiro", () => {
    const s = sugestaoDeAgora({ vencidos: 5, sinais: 10, feitas: nenhuma });
    expect(s).toMatchObject({ titulo: "5 sinais para revisar", href: "/revisar" });
    expect(sugestaoDeAgora({ vencidos: 1, sinais: 1, feitas: nenhuma }).titulo).toBe("1 sinal para revisar");
  });
  it("sem revisão, sugere a próxima aula", () => {
    expect(sugestaoDeAgora({ vencidos: 0, sinais: 0, feitas: nenhuma })).toMatchObject({
      href: `/aulas/${AULAS[0].slug}`,
      botao: "Começar a aula",
    });
    const feitas = new Set([AULAS[0].slug]);
    expect(sugestaoDeAgora({ vencidos: 0, sinais: 3, feitas })).toMatchObject({
      titulo: `Continue: ${AULAS[1].titulo}`,
      botao: "Continuar a aula",
    });
  });
  it("aulas todas feitas e caderno vazio: guardar o primeiro sinal", () => {
    expect(sugestaoDeAgora({ vencidos: 0, sinais: 0, feitas: todas }).href).toBe("/caderno/novo");
  });
  it("tudo em dia: treinar", () => {
    expect(sugestaoDeAgora({ vencidos: 0, sinais: 4, feitas: todas }).titulo).toBe("Tudo em dia!");
  });
});

describe("apoio", () => {
  it("próxima aula pula as concluídas", () => {
    expect(proximaAula(new Set([AULAS[0].slug, AULAS[1].slug]))?.slug).toBe(AULAS[2].slug);
    expect(proximaAula(todas)).toBeNull();
  });
  it("minutos de revisão: 30 s por cartão, no máximo uma sessão", () => {
    expect(minutosDeRevisao(1)).toBe(1);
    expect(minutosDeRevisao(6)).toBe(3);
    expect(minutosDeRevisao(100)).toBe(10);
  });
  it("primeiros passos marcam o que já foi feito", () => {
    expect(primeirosPassos({ aulasFeitas: 1, sinais: 0, revisados: 0 }).map((p) => p.feito)).toEqual([true, false, false]);
  });
  it("saudação pelo horário de Brasília", () => {
    expect(saudacao(new Date("2026-11-04T11:00:00Z"))).toBe("Bom dia"); // 8h
    expect(saudacao(new Date("2026-11-04T17:00:00Z"))).toBe("Boa tarde"); // 14h
    expect(saudacao(new Date("2026-11-04T23:30:00Z"))).toBe("Boa noite"); // 20h30
  });
  it("primeiro nome", () => {
    expect(primeiroNome("  Laize Santos ")).toBe("Laize");
    expect(primeiroNome(null)).toBe("");
  });
});

describe("dataDeHoje", () => {
  it("só a primeira letra maiúscula, no dia de Brasília", () => {
    expect(dataDeHoje(new Date("2026-11-04T12:00:00Z"))).toBe("Quarta-feira, 4 de novembro");
    expect(dataDeHoje(new Date("2026-11-05T01:00:00Z"))).toBe("Quarta-feira, 4 de novembro"); // 22h em Brasília
  });
});
