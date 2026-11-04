import { describe, expect, it } from "vitest";
import { OPCOES_POR_PERGUNTA, montarQuiz, podeFazerQuiz } from "./quiz";

const s = (id: string, word: string, category: string | null, midia = true) => ({
  id,
  word,
  category,
  media_url: midia ? `https://x/${id}` : null,
});

const familia = [s("1", "mãe", "Família"), s("2", "pai", "Família"), s("3", "avó", "Família"), s("4", "tio", "Família")];
const cores = [s("5", "azul", "Cores"), s("6", "verde", "Cores", false), s("7", "rosa", "Cores", false)];

describe("podeFazerQuiz", () => {
  it("precisa de mídia e de 4 palavras diferentes", () => {
    expect(podeFazerQuiz(familia)).toBe(true);
    expect(podeFazerQuiz(familia.slice(0, 3))).toBe(false);
    expect(podeFazerQuiz([...cores.map((c) => ({ ...c, media_url: null })), s("8", "x", null, false)])).toBe(false);
    expect(podeFazerQuiz([s("1", "mãe", null), s("2", "Mãe", null), s("3", "mãe ", null), s("4", "pai", null)])).toBe(false);
  });
});

describe("montarQuiz", () => {
  const todos = [...familia, ...cores];
  const quiz = montarQuiz(todos, () => 0.3);

  it("só pergunta sinais com mídia", () => {
    expect(quiz.every((p) => p.item.media_url)).toBe(true);
    expect(quiz).toHaveLength(5);
  });
  it("4 opções, sem repetir, com a certa entre elas", () => {
    for (const p of quiz) {
      expect(p.opcoes).toHaveLength(OPCOES_POR_PERGUNTA);
      expect(new Set(p.opcoes).size).toBe(OPCOES_POR_PERGUNTA);
      expect(p.opcoes).toContain(p.item.word);
    }
  });
  it("prefere opções erradas do mesmo tema", () => {
    const mae = quiz.find((p) => p.item.word === "mãe")!;
    expect(mae.opcoes.sort()).toEqual(["avó", "mãe", "pai", "tio"]);
  });
  it("completa com outros temas quando o tema tem poucos sinais", () => {
    const azul = quiz.find((p) => p.item.word === "azul")!;
    expect(azul.opcoes).toHaveLength(4);
    expect(azul.opcoes).toEqual(expect.arrayContaining(["azul", "verde", "rosa"]));
  });
  it("vazio quando não dá para montar", () => {
    expect(montarQuiz(familia.slice(0, 2))).toEqual([]);
  });
});
