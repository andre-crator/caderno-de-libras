import { describe, expect, it } from "vitest";
import { DICIONARIOS } from "./dicionarios";
import { temasEmOrdem } from "./unidades";
import { TEMAS_EXTRA, VOCABULARIO, linkGuardar, listaDoTema, normalizarPalavra, progressoDoTema } from "./vocabulario";

describe("vocabulário", () => {
  it("toda lista pertence a um tema da ementa", () => {
    const temas = new Set<string>([...temasEmOrdem(), ...TEMAS_EXTRA]);
    for (const tema of Object.keys(VOCABULARIO)) expect(temas.has(tema), tema).toBe(true);
  });
  it("nenhuma lista repete palavra", () => {
    for (const [tema, palavras] of Object.entries(VOCABULARIO)) {
      const n = palavras.map(normalizarPalavra);
      expect(new Set(n).size, tema).toBe(n.length);
    }
  });
  it("tem os 27 estados (26 + DF)", () => {
    expect(VOCABULARIO["Estados brasileiros"]).toHaveLength(27);
  });
});

describe("normalizarPalavra", () => {
  it("ignora maiúscula, espaço e pontuação de pergunta, mas respeita acento", () => {
    expect(normalizarPalavra("  Avó ")).toBe("avó");
    expect(normalizarPalavra("avô")).not.toBe(normalizarPalavra("avó"));
    expect(normalizarPalavra("Tudo  bem?")).toBe("tudo bem");
  });
});

describe("progresso do tema", () => {
  it("marca as palavras que ela já guardou", () => {
    const lista = listaDoTema("Família", ["Mãe", "Avó", "cachorro"]);
    expect(lista.find((i) => i.palavra === "mãe")?.guardada).toBe(true);
    expect(lista.find((i) => i.palavra === "avó")?.guardada).toBe(true);
    expect(lista.find((i) => i.palavra === "avô")?.guardada).toBe(false);
    expect(lista.find((i) => i.palavra === "pai")?.guardada).toBe(false);
    expect(progressoDoTema("Família", ["Mãe", "Avó"])).toEqual({ feitas: 2, total: 13 });
  });
  it("tema sem lista dá 0 de 0", () => {
    expect(progressoDoTema("Surdez", [])).toEqual({ feitas: 0, total: 0 });
  });
});

describe("dicionários", () => {
  it("monta o link do Spread The Sign com a palavra codificada", () => {
    const sts = DICIONARIOS.find((d) => d.id === "spreadthesign")!;
    expect(sts.link(" bom dia ")).toBe("https://www.spreadthesign.com/pt.br/search/?q=bom%20dia");
  });
});

describe("linkGuardar", () => {
  it("frases abrem o formulário como frase", () => {
    expect(linkGuardar("Não entendi", "Frases para conversar")).toBe(
      "/caderno/novo?palavra=N%C3%A3o%20entendi&tema=Frases%20para%20conversar&tipo=frase",
    );
    expect(linkGuardar("mãe", "Família")).not.toContain("tipo=");
  });
});
