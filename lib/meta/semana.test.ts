import { describe, expect, it } from "vitest";
import { diaEmBrasilia, mensagemDoLembrete, resumoDaSemana } from "./semana";

// Quarta, 4/11/2026, 15h em Brasília.
const quarta = new Date("2026-11-04T18:00:00Z");

describe("diaEmBrasilia", () => {
  it("usa o fuso de Brasília", () => {
    expect(diaEmBrasilia(new Date("2026-11-05T02:30:00Z"))).toBe("2026-11-04");
    expect(diaEmBrasilia(new Date("2026-11-05T03:30:00Z"))).toBe("2026-11-05");
  });
});

describe("resumoDaSemana", () => {
  it("marca os dias de segunda a domingo e o de hoje", () => {
    const s = resumoDaSemana(["2026-11-02", "2026-11-04", "2026-11-01"], 3, quarta);
    expect(s.dias).toEqual([true, false, true, false, false, false, false]);
    expect(s.hoje).toBe(2);
    expect(s.feitos).toBe(2);
    expect(s.cumpriu).toBe(false);
  });
  it("sequência de semanas com a meta", () => {
    const dias = [
      // semana atual: 2 dias (meta 2 cumprida)
      "2026-11-02", "2026-11-03",
      // semana passada: 2
      "2026-10-26", "2026-10-30",
      // retrasada: 2
      "2026-10-19", "2026-10-25",
      // antes: só 1 (quebra)
      "2026-10-14",
    ];
    expect(resumoDaSemana(dias, 2, quarta).sequencia).toBe(3);
    // semana atual ainda não cumpriu: conta só as anteriores
    expect(resumoDaSemana(dias, 3, quarta).sequencia).toBe(0);
    expect(resumoDaSemana(dias.slice(2), 2, quarta).sequencia).toBe(2);
  });
  it("meta inválida vira 3", () => {
    expect(resumoDaSemana([], 0, quarta).meta).toBe(3);
  });
});

describe("mensagemDoLembrete", () => {
  it("não manda nada se já estudou hoje", () => {
    expect(mensagemDoLembrete({ vencidos: 5, estudou_hoje: true, dias_na_semana: 0, meta: 3 })).toBeNull();
  });
  it("revisão primeiro", () => {
    const m = mensagemDoLembrete({ vencidos: 8, estudou_hoje: false, dias_na_semana: 0, meta: 3 })!;
    expect(m.texto).toBe("Você tem 8 sinais para revisar. Leva uns 2 minutos.");
    expect(m.url).toBe("/revisar");
  });
  it("sem revisão: convida pela meta; meta cumprida: silêncio", () => {
    expect(mensagemDoLembrete({ vencidos: 0, estudou_hoje: false, dias_na_semana: 2, meta: 3 })!.texto).toBe(
      "Falta 1 dia para a sua meta da semana.",
    );
    expect(mensagemDoLembrete({ vencidos: 0, estudou_hoje: false, dias_na_semana: 3, meta: 3 })).toBeNull();
  });
});
