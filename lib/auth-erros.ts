// Traduz erros do login (Supabase Auth) para mensagens claras em português.
// Sem internet não é "senha errada": cada caso diz o que aconteceu e o que fazer.

export type ErroAuth = { name?: string; message?: string; code?: string; status?: number } | null | undefined;
export type Contexto = "entrar" | "criar" | "google";

export const SEM_CONEXAO = "Não foi possível conectar. Confira a internet e tente de novo.";

export function ehErroDeConexao(e: ErroAuth): boolean {
  if (!e) return false;
  const msg = (e.message ?? "").toLowerCase();
  return (
    e.name === "AuthRetryableFetchError" ||
    e.status === 0 ||
    msg.includes("failed to fetch") ||
    msg.includes("networkerror") ||
    msg.includes("network request failed") ||
    msg.includes("load failed")
  );
}

export function mensagemDeErro(e: ErroAuth, contexto: Contexto): string {
  if (ehErroDeConexao(e)) return SEM_CONEXAO;
  switch (e?.code) {
    case "invalid_credentials":
      return "E-mail ou senha incorretos.";
    case "email_not_confirmed":
      return "Confirme seu e-mail primeiro: abra o link que enviamos para a sua caixa de entrada.";
    case "user_already_exists":
    case "email_exists":
      return "Já existe uma conta com esse e-mail. Toque em “Já tem conta? Entrar”.";
    case "weak_password":
      return "Senha fraca. Use pelo menos 8 caracteres, misturando letras e números.";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "Muitas tentativas seguidas. Espere alguns minutos e tente de novo.";
    case "signup_disabled":
      return "Criar conta está desativado no momento.";
  }
  if (contexto === "entrar" && e?.status === 400) return "E-mail ou senha incorretos.";
  if (contexto === "google") return "Não foi possível entrar com o Google. Tente de novo.";
  return contexto === "criar"
    ? "Não foi possível criar a conta agora. Tente de novo em instantes."
    : "Não foi possível entrar agora. Tente de novo em instantes.";
}
