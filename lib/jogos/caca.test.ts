import { describe, expect, it } from "vitest";
import type { Aula } from "@/lib/aulas/conteudo";
import { VOCABULARIO } from "@/lib/curso/vocabulario";
import { inicioDaSemana, missoesDaSemana, temasDaCaca } from "./caca";

const aula = (slug: string, temas: string[]): Aula => ({ slug, unidade: 1, titulo: slug, objetivo: "", secoes: [], temas });

describe("inicioDaSemana", () => {
  it("segunda 00:00 em Brasília (03:00 UTC)", () => {
    // quarta, 4/11/2026, 15h em Brasília
    expect(inicioDaSemana(new Date("2026-11-04T18:00:00Z")).toISOString()).toBe("2026-11-02T03:00:00.000Z");
    // domingo 23h em Brasília ainda é a semana que começou na segunda anterior
    expect(inicioDaSemana(new Date("2026-11-09T02:00:00Z")).toISOString()).toBe("2026-11-02T03:00:00.000Z");
    // segunda 00:30 em Brasília já é a semana nova
    expect(inicioDaSemana(new Date("2026-11-09T03:30:00Z")).toISOString()).toBe("2026-11-09T03:00:00.000Z");
  });
});

describe("temasDaCaca", () => {
  const aulas = [aula("u1-a", []), aula("u2-b", ["Saudações"]), aula("u3-c", ["Família", "Inexistente"])];
  it("usa a aula atual ou a próxima com lista", () => {
    expect(temasDaCaca(aulas, "u3-c")).toEqual(["Família"]);
    expect(temasDaCaca(aulas, "u1-a")).toEqual(["Saudações"]);
    expect(temasDaCaca(aulas, null)).toEqual(["Saudações"]);
  });
});

describe("missoesDaSemana", () => {
  const quarta = new Date("2026-11-04T18:00:00Z");
  it("3 palavras do tema, iguais a semana toda, sem as que ela já tinha", () => {
    const jaTinha = [{ word: "Mãe", created_at: "2026-10-01T00:00:00Z" }];
    const m = missoesDaSemana(["Família"], jaTinha, quarta);
    expect(m).toHaveLength(3);
    expect(m.every((x) => VOCABULARIO["Família"].includes(x.palavra))).toBe(true);
    expect(m.map((x) => x.palavra)).not.toContain("mãe");
    expect(missoesDaSemana(["Família"], jaTinha, new Date("2026-11-08T12:00:00Z"))).toEqual(m);
  });
  it("guardar durante a semana marca como feita sem trocar a missão", () => {
    const m = missoesDaSemana(["Família"], [], quarta);
    const depois = missoesDaSemana(["Família"], [{ word: m[1].palavra.toUpperCase(), created_at: "2026-11-04T19:00:00Z" }], quarta);
    expect(depois.map((x) => x.palavra)).toEqual(m.map((x) => x.palavra));
    expect(depois.map((x) => x.feita)).toEqual([false, true, false]);
  });
  it("semana nova, missões novas", () => {
    const a = missoesDaSemana(["Família"], [], quarta).map((x) => x.palavra);
    const b = missoesDaSemana(["Família"], [], new Date("2026-11-11T18:00:00Z")).map((x) => x.palavra);
    expect(a).not.toEqual(b);
  });
});
