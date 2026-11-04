import { describe, expect, it } from "vitest";
import { CONTEXTOS, FAIXAS, PALAVRAS, itensParaSoletrar, limitarTempo, sortearNumero, sortearPalavra } from "./sequencia";

describe("itensParaSoletrar", () => {
  it("mantém acentos e cedilha, em maiúsculas, e ignora espaços e sinais", () => {
    expect(itensParaSoletrar("maçã!", "letras")).toEqual(["M", "A", "Ç", "Ã"]);
    expect(itensParaSoletrar("Ana Lú", "letras")).toEqual(["A", "N", "A", "L", "Ú"]);
  });
  it("no modo números pega só os dígitos", () => {
    expect(itensParaSoletrar("(11) 98765-4321", "numeros")).toEqual("11987654321".split(""));
    expect(itensParaSoletrar("abc", "numeros")).toEqual([]);
  });
});

describe("sortearPalavra", () => {
  it("usa a lista padrão", () => {
    expect(sortearPalavra([], () => 0)).toBe(PALAVRAS[0]);
  });
  it("inclui palavras dela válidas e descarta frases e palavras longas", () => {
    const extras = ["bom dia", "x", "abacaxizeiros", "mãe"];
    const total = PALAVRAS.length + 1; // só "MÃE" entra
    expect(sortearPalavra(extras, () => (total - 1) / total)).toBe("MÃE");
  });
});

describe("sortearNumero", () => {
  it("respeita os limites de cada faixa", () => {
    for (const f of FAIXAS) {
      expect(Number(sortearNumero(f.id, () => 0))).toBe(f.min);
      expect(Number(sortearNumero(f.id, () => 1 - Number.EPSILON))).toBe(f.max);
    }
  });
  it("telefone tem 9 dígitos", () => {
    expect(sortearNumero("telefone", () => 0.5)).toHaveLength(9);
  });
});

describe("limitarTempo", () => {
  it("prende entre 0,5 e 2,5 s", () => {
    expect(limitarTempo(0.1)).toBe(0.5);
    expect(limitarTempo(9)).toBe(2.5);
    expect(limitarTempo(1.23)).toBe(1.2);
    expect(limitarTempo(Number.NaN)).toBe(1.2);
  });
});

describe("datas, horas e dinheiro", () => {
  it("sorteia no formato do dia a dia", () => {
    expect(sortearNumero("data", () => 0)).toBe("01/01");
    expect(sortearNumero("hora", () => 1 - Number.EPSILON)).toBe("23:55");
    expect(sortearNumero("dinheiro", () => 0)).toBe("R$ 1,00");
    expect(CONTEXTOS.map((c) => c.id)).toEqual(["data", "hora", "dinheiro"]);
  });
  it("mostra em grupos, não dígito por dígito", () => {
    expect(itensParaSoletrar("25/12", "numeros")).toEqual(["25", "12"]);
    expect(itensParaSoletrar("14:30", "numeros")).toEqual(["14", "30"]);
    expect(itensParaSoletrar("R$ 37,50", "numeros")).toEqual(["37", "50"]);
    expect(itensParaSoletrar("987654321", "numeros")).toHaveLength(9);
  });
});
