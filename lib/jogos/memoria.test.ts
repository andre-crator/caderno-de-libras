import { describe, expect, it } from "vitest";
import { formamPar, formatarTempo, montarMemoria, paresDificeis, podeJogarMemoria } from "./memoria";

const s = (id: string, word: string, midia = true) => ({ id, word, category: null, media_url: midia ? `u/${id}` : null });
const oito = ["mãe", "pai", "avó", "avô", "tio", "tia", "irmão", "irmã"].map((w, i) => s(String(i), w));

describe("podeJogarMemoria", () => {
  it("precisa de 3 palavras diferentes com mídia", () => {
    expect(podeJogarMemoria(oito.slice(0, 3))).toBe(true);
    expect(podeJogarMemoria([s("1", "mãe"), s("2", "Mãe "), s("3", "pai"), s("4", "tio", false)])).toBe(false);
  });
});

describe("montarMemoria", () => {
  it("6 pares = 12 cartas, cada sinal com mídia e palavra", () => {
    const cartas = montarMemoria(oito, () => 0.4);
    expect(cartas).toHaveLength(12);
    const ids = new Set(cartas.map((c) => c.item.id));
    expect(ids.size).toBe(6);
    for (const id of ids) {
      expect(cartas.filter((c) => c.item.id === id).map((c) => c.lado).sort()).toEqual(["midia", "palavra"]);
    }
    expect(new Set(cartas.map((c) => c.chave)).size).toBe(12);
  });
  it("ignora sinais sem mídia e não monta com menos de 3 pares", () => {
    expect(montarMemoria([s("1", "a"), s("2", "b"), s("3", "c", false)])).toEqual([]);
  });
});

describe("regras", () => {
  it("par = mesmo sinal, lados diferentes", () => {
    const [a] = oito;
    expect(formamPar({ chave: "1", item: a, lado: "midia" }, { chave: "2", item: a, lado: "palavra" })).toBe(true);
    expect(formamPar({ chave: "1", item: a, lado: "midia" }, { chave: "2", item: oito[1], lado: "palavra" })).toBe(false);
  });
  it("difícil = errou 2 vezes ou mais", () => {
    expect(paresDificeis({ a: 1, b: 2, c: 3 })).toEqual(["b", "c"]);
  });
  it("formata o tempo", () => {
    expect(formatarTempo(65)).toBe("1:05");
    expect(formatarTempo(9.8)).toBe("0:09");
  });
});
