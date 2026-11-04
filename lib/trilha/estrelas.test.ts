import { describe, expect, it } from "vitest";
import { AULAS } from "@/lib/aulas/conteudo";
import { getAula } from "@/lib/aulas/aulas";
import { montarTrilha, paradaAtual, sinaisDaAula } from "./estrelas";

const s = (word: string, review_level = 0, category: string | null = null, lesson: string | null = null) => ({
  word,
  category,
  lesson,
  review_level,
});

describe("sinaisDaAula", () => {
  it("aula com lista conta palavras da lista (acento e maiúscula como na lista)", () => {
    const pronomes = getAula("u2-pronomes")!;
    expect(sinaisDaAula(pronomes, [s("Eu"), s("você"), s("mãe")]).map((x) => x.word)).toEqual(["Eu", "você"]);
  });
  it("aula sem lista conta os sinais da unidade", () => {
    const parametros = getAula("u2-parametros")!;
    expect(sinaisDaAula(parametros, [s("x", 0, null, "Unidade 2"), s("y", 0, null, "Unidade 3")])).toHaveLength(1);
  });
});

describe("montarTrilha", () => {
  it("concluir a aula dá 1 estrela", () => {
    const t = montarTrilha(AULAS, new Set([AULAS[0].slug]), []);
    expect(t[0].total).toBe(1);
    expect(t[1].total).toBe(0);
  });
  it("3 estrelas: assistiu, praticou (3 sinais) e fixou (3 com nível ≥ 2)", () => {
    const pronomes = AULAS.findIndex((a) => a.slug === "u2-pronomes");
    const sinais = [s("eu", 2), s("você", 3), s("ele", 2)];
    const t = montarTrilha(AULAS, new Set([AULAS[pronomes].slug]), sinais);
    expect(t[pronomes].estrelas).toEqual({ assistiu: true, praticou: true, fixou: true });
    expect(t[pronomes].total).toBe(3);
  });
  it("praticou sem fixar", () => {
    const pronomes = AULAS.findIndex((a) => a.slug === "u2-pronomes");
    const t = montarTrilha(AULAS, new Set(), [s("eu", 1), s("você"), s("ele")]);
    expect(t[pronomes].estrelas.praticou).toBe(true);
    expect(t[pronomes].estrelas.fixou).toBe(false);
  });
});

describe("paradaAtual", () => {
  it("sem nada concluído, é a primeira", () => {
    expect(paradaAtual(montarTrilha(AULAS, new Set(), []))?.aula.slug).toBe(AULAS[0].slug);
  });
  it("é a parada depois da última aula concluída", () => {
    const t = montarTrilha(AULAS, new Set([AULAS[0].slug, AULAS[4].slug]), []);
    expect(paradaAtual(t)?.aula.slug).toBe(AULAS[5].slug);
  });
});
