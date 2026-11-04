import { describe, expect, it } from "vitest";
import { VOCABULARIO } from "@/lib/curso/vocabulario";
import { AULAS } from "./conteudo";
import {
  VIDEOS,
  aulasPorUnidade,
  buscaNoYoutube,
  getAula,
  idYoutubeValido,
  partesComNegrito,
  urlDoPlayer,
  videosDaAula,
  vizinhas,
} from "./aulas";

describe("conteúdo das aulas", () => {
  it("slugs únicos e no formato u<unidade>-...", () => {
    const slugs = AULAS.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const a of AULAS) expect(a.slug.startsWith(`u${a.unidade}-`), a.slug).toBe(true);
  });
  it("todo tema do 'Pratique' existe nas listas de estudo", () => {
    for (const a of AULAS) for (const t of a.temas) expect(VOCABULARIO[t], `${a.slug}: ${t}`).toBeDefined();
  });
  it("toda aula tem pelo menos um vídeo válido", () => {
    for (const a of AULAS) expect(videosDaAula(a.slug).length, a.slug).toBeGreaterThan(0);
  });
  it("todo vídeo aponta para uma aula que existe, com ID válido e sem repetir", () => {
    for (const v of VIDEOS) {
      expect(getAula(v.aula), v.id).not.toBeNull();
      expect(idYoutubeValido(v.id), v.id).toBe(true);
    }
    expect(new Set(VIDEOS.map((v) => v.id)).size).toBe(VIDEOS.length);
  });
  it("o negrito do texto fecha direitinho", () => {
    for (const a of AULAS)
      for (const s of a.secoes)
        for (const t of [...s.paragrafos, ...(s.itens ?? [])]) expect((t.match(/\*\*/g) ?? []).length % 2, t).toBe(0);
  });
});

describe("funções", () => {
  it("agrupa por unidade em ordem", () => {
    expect(aulasPorUnidade().map((u) => u.unidade)).toEqual([1, 2, 3]);
  });
  it("acha aula anterior e próxima", () => {
    const { anterior, proxima } = vizinhas("u2-parametros");
    expect(anterior?.slug).toBe("u1-libras-e-uma-lingua");
    expect(proxima?.slug).toBe("u2-alfabeto-manual");
    expect(vizinhas(AULAS[0].slug).anterior).toBeNull();
  });
  it("monta player sem cookies e busca no YouTube", () => {
    expect(urlDoPlayer("Y7mxW5UAsu0")).toMatch(/^https:\/\/www\.youtube-nocookie\.com\/embed\/Y7mxW5UAsu0\?/);
    expect(buscaNoYoutube("Números")).toContain("N%C3%BAmeros%20em%20Libras");
  });
  it("valida ID do YouTube", () => {
    expect(idYoutubeValido("hj-IffUptPM")).toBe(true);
    expect(idYoutubeValido("curto")).toBe(false);
    expect(idYoutubeValido("<script>xxxx")).toBe(false);
  });
  it("separa o negrito", () => {
    expect(partesComNegrito("a **b** c")).toEqual([
      { texto: "a ", negrito: false },
      { texto: "b", negrito: true },
      { texto: " c", negrito: false },
    ]);
  });
});
