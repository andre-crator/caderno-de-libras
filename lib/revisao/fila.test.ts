import { describe, expect, it } from "vitest";
import { contarVencidos, montarFila, reenfileirar } from "./fila";

const agora = new Date("2026-11-04T12:00:00Z");
const item = (id: string, due: string, nivel = 0, midia = true) => ({
  id,
  review_level: nivel,
  review_due_at: due,
  media_url: midia ? `https://x/${id}` : null,
});

const itens = [
  item("futuro", "2026-11-10T03:00:00Z"),
  item("ontem-n2", "2026-11-03T03:00:00Z", 2),
  item("ontem-n0", "2026-11-03T03:00:00Z", 0, false),
  item("semana", "2026-10-28T03:00:00Z", 3),
];

describe("montarFila", () => {
  it("pega só os vencidos, mais atrasados e de nível menor primeiro", () => {
    expect(montarFila(itens, agora, { modo: "palavra" }).map((i) => i.id)).toEqual(["semana", "ontem-n0", "ontem-n2"]);
  });
  it("no modo sinal → palavra só entram cartões com mídia", () => {
    expect(montarFila(itens, agora, { modo: "sinal" }).map((i) => i.id)).toEqual(["semana", "ontem-n2"]);
  });
  it("respeita o limite da sessão", () => {
    const muitos = Array.from({ length: 30 }, (_, n) => item(`s${n}`, "2026-11-01T03:00:00Z"));
    expect(montarFila(muitos, agora, { modo: "palavra" })).toHaveLength(20);
    expect(montarFila(muitos, agora, { modo: "palavra", limite: 5 })).toHaveLength(5);
  });
  it("no treino livre inclui os que ainda não venceram", () => {
    const ids = montarFila(itens, agora, { modo: "palavra", todos: true, aleatorio: () => 0 }).map((i) => i.id);
    expect(ids.sort()).toEqual(["futuro", "ontem-n0", "ontem-n2", "semana"]);
  });
});

describe("contarVencidos", () => {
  it("conta os que venceram até agora", () => {
    expect(contarVencidos(itens, agora)).toBe(3);
  });
});

describe("reenfileirar", () => {
  it("coloca o cartão errado de novo no fim", () => {
    expect(reenfileirar([{ id: "a" }, { id: "b" }], 0).map((i) => i.id)).toEqual(["a", "b", "a"]);
  });
});
