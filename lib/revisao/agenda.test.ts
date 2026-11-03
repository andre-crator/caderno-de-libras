import { describe, expect, it } from "vitest";
import {
  NIVEL_MAXIMO,
  estaVencido,
  inicioDoDiaEmBrasilia,
  limitarNivel,
  proximaRevisao,
} from "./agenda";

// 22h de 03/11/2026 em Brasília = 01h de 04/11 em UTC.
const agora = new Date("2026-11-04T01:00:00Z");

describe("inicioDoDiaEmBrasilia", () => {
  it("usa o dia de Brasília, não o de UTC", () => {
    expect(inicioDoDiaEmBrasilia(agora, 0).toISOString()).toBe("2026-11-03T03:00:00.000Z");
  });
  it("soma dias a partir da meia-noite de Brasília", () => {
    expect(inicioDoDiaEmBrasilia(agora, 1).toISOString()).toBe("2026-11-04T03:00:00.000Z");
    expect(inicioDoDiaEmBrasilia(agora, 16).toISOString()).toBe("2026-11-19T03:00:00.000Z");
  });
});

describe("proximaRevisao", () => {
  it("errei: volta ao nível 0 e fica para agora", () => {
    expect(proximaRevisao(4, "errei", agora)).toEqual({ nivel: 0, proximaEm: agora });
  });

  it("com dúvida: mantém o nível (mínimo 1) e volta amanhã de manhã", () => {
    const r = proximaRevisao(0, "duvida", agora);
    expect(r.nivel).toBe(1);
    expect(r.proximaEm.toISOString()).toBe("2026-11-04T03:00:00.000Z");
    expect(proximaRevisao(3, "duvida", agora).nivel).toBe(3);
  });

  it("acertei: sobe um nível e segue os intervalos 1, 2, 4, 8, 16 dias", () => {
    const dias = [1, 2, 4, 8, 16].map((_, i) => {
      const r = proximaRevisao(i, "acertei", agora);
      return Math.round((r.proximaEm.getTime() - inicioDoDiaEmBrasilia(agora, 0).getTime()) / 86_400_000);
    });
    expect(dias).toEqual([1, 2, 4, 8, 16]);
  });

  it("acertei no nível máximo continua no máximo", () => {
    expect(proximaRevisao(NIVEL_MAXIMO, "acertei", agora).nivel).toBe(NIVEL_MAXIMO);
  });

  it("revisar à noite não empurra o cartão para a noite seguinte", () => {
    const r = proximaRevisao(0, "acertei", agora);
    const manhaSeguinte = new Date("2026-11-04T11:00:00Z"); // 8h em Brasília
    expect(estaVencido(r.proximaEm, manhaSeguinte)).toBe(true);
  });
});

describe("limitarNivel", () => {
  it("prende o nível entre 0 e 5", () => {
    expect(limitarNivel(-2)).toBe(0);
    expect(limitarNivel(9)).toBe(5);
    expect(limitarNivel(2.7)).toBe(2);
    expect(limitarNivel(Number.NaN)).toBe(0);
  });
});
