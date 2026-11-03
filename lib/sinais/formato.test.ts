import { describe, expect, it } from "vitest";
import {
  midiaNaPastaDe,
  limparTexto,
  novoCaminhoMidia,
  problemaNoArquivo,
  tamanhoReduzido,
  tipoDaMidia,
  validarSinal,
} from "./formato";

const ana = "11111111-1111-1111-1111-111111111111";

describe("validarSinal", () => {
  it("limpa espaços e transforma campos vazios em null", () => {
    const r = validarSinal({ word: "  Bom   dia ", category: " ", tip: "mão aberta" }, ana);
    expect(r).toMatchObject({ ok: true, dados: { word: "Bom dia", category: null, tip: "mão aberta", kind: "sinal" } });
  });
  it("exige a palavra", () => {
    expect(validarSinal({ word: "   " }, ana)).toEqual({ ok: false, erros: ["Escreva a palavra ou a frase."] });
  });
  it("aceita frase e recusa tipo desconhecido como sinal", () => {
    expect(validarSinal({ word: "Prazer", kind: "frase" }, ana)).toMatchObject({ dados: { kind: "frase" } });
    expect(validarSinal({ word: "Oi", kind: "outro" }, ana)).toMatchObject({ dados: { kind: "sinal" } });
  });
  it("respeita os limites de tamanho", () => {
    const r = validarSinal({ word: "x".repeat(121) }, ana);
    expect(r.ok).toBe(false);
  });
  it("aceita mídia na pasta dela e recusa na pasta de outra pessoa", () => {
    expect(validarSinal({ word: "Oi", media_path: `${ana}/a.jpg`, media_type: "foto" }, ana).ok).toBe(true);
    expect(validarSinal({ word: "Oi", media_path: `outra/a.jpg`, media_type: "foto" }, ana).ok).toBe(false);
    expect(validarSinal({ word: "Oi", media_path: `${ana}/../x.jpg`, media_type: "foto" }, ana).ok).toBe(false);
  });
  it("recusa caminho sem tipo e tipo sem caminho", () => {
    expect(validarSinal({ word: "Oi", media_path: `${ana}/a.jpg` }, ana).ok).toBe(false);
    expect(validarSinal({ word: "Oi", media_type: "video" }, ana).ok).toBe(false);
  });
});

describe("mídia", () => {
  it("reconhece foto e vídeo do celular", () => {
    expect(tipoDaMidia("image/jpeg")).toBe("foto");
    expect(tipoDaMidia("video/quicktime")).toBe("video");
    expect(tipoDaMidia("application/pdf")).toBeNull();
  });
  it("monta o caminho dentro da pasta dela", () => {
    const c = novoCaminhoMidia(ana, "video/mp4", new Date("2026-11-04T12:00:00Z"), "Ab-12!cd");
    expect(c).toBe(`${ana}/20261104-Ab12cd.mp4`);
    expect(midiaNaPastaDe(ana, c)).toBe(true);
  });
  it("explica o problema do arquivo", () => {
    expect(problemaNoArquivo("application/pdf", 10)).toMatch(/não é foto nem vídeo/);
    expect(problemaNoArquivo("video/mp4", 30 * 1024 * 1024)).toMatch(/20 MB/);
    expect(problemaNoArquivo("video/mp4", 1000, 20)).toMatch(/15 segundos/);
    expect(problemaNoArquivo("video/mp4", 1000, 15.3)).toBeNull();
    expect(problemaNoArquivo("image/png", 1000)).toBeNull();
  });
  it("reduz a foto mantendo a proporção", () => {
    expect(tamanhoReduzido(4000, 3000)).toEqual({ largura: 1280, altura: 960 });
    expect(tamanhoReduzido(800, 600)).toEqual({ largura: 800, altura: 600 });
  });
});

describe("limparTexto", () => {
  it("ignora o que não é texto", () => {
    expect(limparTexto(undefined)).toBeNull();
    expect(limparTexto(3)).toBeNull();
  });
});
