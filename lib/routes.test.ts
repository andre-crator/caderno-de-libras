import { describe, expect, it } from "vitest";
import { isPrivatePath, safeNextPath } from "./routes";

describe("safeNextPath", () => {
  it("aceita caminhos internos", () => {
    expect(safeNextPath("/painel/config")).toBe("/painel/config");
  });

  it("usa o padrão quando não há next", () => {
    expect(safeNextPath(null)).toBe("/painel");
    expect(safeNextPath("")).toBe("/painel");
  });

  it("bloqueia redirecionamento para outro site (open redirect)", () => {
    expect(safeNextPath("https://site-falso.com")).toBe("/painel");
    expect(safeNextPath("//site-falso.com")).toBe("/painel");
    expect(safeNextPath("/\\site-falso.com")).toBe("/painel");
  });
});

describe("isPrivatePath", () => {
  it("protege o prefixo e as subrotas", () => {
    expect(isPrivatePath("/painel")).toBe(true);
    expect(isPrivatePath("/painel/perfil")).toBe(true);
    expect(isPrivatePath("/caderno")).toBe(true);
    expect(isPrivatePath("/caderno/novo")).toBe(true);
    expect(isPrivatePath("/revisar")).toBe(true);
    expect(isPrivatePath("/aulas/u2-numeros")).toBe(true);
  });

  it("não protege rotas públicas nem nomes parecidos", () => {
    expect(isPrivatePath("/")).toBe(false);
    expect(isPrivatePath("/login")).toBe(false);
    expect(isPrivatePath("/painelzinho")).toBe(false);
  });
});
