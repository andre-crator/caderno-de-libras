import { describe, expect, it } from "vitest";
import { parseConfirmParams } from "./auth-confirm";

const params = (q: string) => new URLSearchParams(q);

describe("parseConfirmParams", () => {
  it("lê token_hash, type e next", () => {
    expect(parseConfirmParams(params("token_hash=abc&type=email&next=/devocional"))).toEqual({
      tokenHash: "abc",
      type: "email",
      next: "/devocional",
    });
  });

  it("usa /painel quando não há next", () => {
    expect(parseConfirmParams(params("token_hash=abc&type=signup"))?.next).toBe("/painel");
  });

  it("não deixa o next levar para outro site", () => {
    expect(parseConfirmParams(params("token_hash=abc&type=email&next=//site-falso.com"))?.next).toBe(
      "/painel",
    );
  });

  it("recusa link sem token_hash ou sem type", () => {
    expect(parseConfirmParams(params("type=email"))).toBeNull();
    expect(parseConfirmParams(params("token_hash=abc"))).toBeNull();
  });

  it("recusa tipo desconhecido", () => {
    expect(parseConfirmParams(params("token_hash=abc&type=qualquer"))).toBeNull();
  });
});
