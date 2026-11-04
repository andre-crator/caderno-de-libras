import { describe, expect, it } from "vitest";
import { pontosDoAcerto, rotuloVelocidade, velocidadeDe } from "./relampago";

describe("relâmpago", () => {
  it("começa em 0,5× e acelera a cada 5 acertos, com teto", () => {
    expect([0, 4, 5, 9, 10, 15, 20, 99].map(velocidadeDe)).toEqual([0.5, 0.5, 0.75, 0.75, 1, 1.25, 1.5, 1.5]);
  });
  it("pontos crescem com a velocidade e o combo", () => {
    expect(pontosDoAcerto(0.5, 1)).toBe(5);
    expect(pontosDoAcerto(1, 3)).toBe(20);
  });
  it("rótulos", () => {
    expect(rotuloVelocidade(0.75)).toBe("0,75×");
    expect(rotuloVelocidade(1)).toBe("Normal");
  });
});

import { podeJogarRelampago, proximaPergunta } from "./relampago";

const v = (id: string, word: string, category: string | null = null) => ({ id, word, category });

describe("proximaPergunta", () => {
  const videos = [v("1", "mãe", "Família"), v("2", "pai", "Família"), v("3", "azul", "Cores")];
  const todos = [...videos, v("4", "tio", "Família"), v("5", "verde", "Cores")];
  it("não repete o vídeo anterior e traz 3 opções diferentes com a certa", () => {
    for (let i = 0; i < 20; i++) {
      const p = proximaPergunta(videos, todos, "1")!;
      expect(p.item.id).not.toBe("1");
      expect(new Set(p.opcoes).size).toBe(3);
      expect(p.opcoes).toContain(p.item.word);
    }
  });
  it("prefere erradas do mesmo tema", () => {
    const p = proximaPergunta([videos[0]], todos, null, () => 0.1)!;
    expect(p.opcoes.sort()).toEqual(["mãe", "pai", "tio"]);
  });
  it("precisa de 3 vídeos de palavras diferentes", () => {
    expect(podeJogarRelampago(videos, todos)).toBe(true);
    expect(podeJogarRelampago(videos.slice(0, 2), todos)).toBe(false);
  });
});
