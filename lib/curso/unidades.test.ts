import { describe, expect, it } from "vitest";
import { UNIDADES, rotuloUnidade, temasEmOrdem, unidadeDoTema } from "./unidades";

describe("roteiro do curso", () => {
  it("tem 12 unidades em ordem, todas com tema", () => {
    expect(UNIDADES.map((u) => u.numero)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(UNIDADES.every((u) => u.temas.length > 0)).toBe(true);
  });
  it("não repete tema", () => {
    const temas = temasEmOrdem().map((t) => t.toLocaleLowerCase("pt-BR"));
    expect(new Set(temas).size).toBe(temas.length);
  });
  it("acha a unidade de um tema sem ligar para maiúsculas e espaços", () => {
    expect(unidadeDoTema("  família ")).toBe(4);
    expect(unidadeDoTema("Cores")).toBe(6);
    expect(unidadeDoTema("Meu tema")).toBeNull();
  });
  it("monta o rótulo da unidade", () => {
    expect(rotuloUnidade(3)).toBe("Unidade 3");
  });
});
