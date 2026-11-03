import { describe, expect, it } from "vitest";
import { SEM_CONEXAO, ehErroDeConexao, mensagemDeErro } from "./auth-erros";

describe("mensagemDeErro", () => {
  it("sem internet não vira 'senha errada'", () => {
    expect(mensagemDeErro({ name: "AuthRetryableFetchError", message: "Failed to fetch", status: 0 }, "entrar")).toBe(SEM_CONEXAO);
    expect(mensagemDeErro({ message: "Failed to fetch" }, "criar")).toBe(SEM_CONEXAO);
    expect(mensagemDeErro({ message: "Load failed" }, "google")).toBe(SEM_CONEXAO);
  });
  it("traduz os códigos do Supabase", () => {
    expect(mensagemDeErro({ code: "invalid_credentials", status: 400 }, "entrar")).toBe("E-mail ou senha incorretos.");
    expect(mensagemDeErro({ code: "user_already_exists", status: 422 }, "criar")).toMatch(/Já existe uma conta/);
    expect(mensagemDeErro({ code: "weak_password", status: 422 }, "criar")).toMatch(/Senha fraca/);
    expect(mensagemDeErro({ code: "email_not_confirmed", status: 400 }, "entrar")).toMatch(/Confirme seu e-mail/);
    expect(mensagemDeErro({ code: "over_request_rate_limit", status: 429 }, "entrar")).toMatch(/Muitas tentativas/);
  });
  it("nunca mostra a mensagem crua em inglês", () => {
    const m = mensagemDeErro({ message: "Some unexpected English error", status: 500 }, "criar");
    expect(m).toBe("Não foi possível criar a conta agora. Tente de novo em instantes.");
    expect(mensagemDeErro({ message: "boom", status: 500 }, "entrar")).toMatch(/Não foi possível entrar/);
  });
});

describe("ehErroDeConexao", () => {
  it("só reconhece falhas de rede", () => {
    expect(ehErroDeConexao({ code: "invalid_credentials", status: 400 })).toBe(false);
    expect(ehErroDeConexao(null)).toBe(false);
  });
});
