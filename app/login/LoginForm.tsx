"use client";
// Formulário de login: e-mail + senha (entrar ou criar conta) e "Entrar com Google".
// Roda no navegador porque o login com Google precisa redirecionar a página.

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { limparCacheDaConta } from "@/components/RegistrarSW";
import styles from "./login.module.css";

type Mode = "entrar" | "criar";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("entrar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ kind: "erro" | "ok"; text: string } | null>(null);

  const callbackUrl = () =>
    `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    const supabase = createClient();

    if (mode === "entrar") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return setMessage({ kind: "erro", text: "E-mail ou senha incorretos." });
      limparCacheDaConta(); // nada da conta anterior fica guardado para uso offline
      router.replace(nextPath);
      router.refresh(); // faz os Server Components lerem a sessão nova
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: callbackUrl() },
    });
    setLoading(false);
    if (error) return setMessage({ kind: "erro", text: error.message });
    setMessage({ kind: "ok", text: "Conta criada! Confira seu e-mail para confirmar." });
  }

  async function handleGoogle() {
    setLoading(true);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callbackUrl() },
    });
    // Em caso de sucesso o navegador sai desta página; só chega aqui se falhar.
    if (error) {
      setLoading(false);
      setMessage({ kind: "erro", text: "Não foi possível entrar com o Google." });
    }
  }

  return (
    <>
      <button type="button" className={styles.google} onClick={handleGoogle} disabled={loading}>
        Entrar com Google
      </button>

      <div className={styles.divider}>ou</div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          E-mail
          <input
            className={styles.input}
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className={styles.label}>
          Senha
          <input
            className={styles.input}
            type="password"
            autoComplete={mode === "entrar" ? "current-password" : "new-password"}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {message && (
          <p className={message.kind === "erro" ? styles.error : styles.ok} role="status">
            {message.text}
          </p>
        )}

        <button type="submit" className={styles.primary} disabled={loading}>
          {loading ? "Aguarde..." : mode === "entrar" ? "Entrar" : "Criar conta"}
        </button>
      </form>

      <button
        type="button"
        className={styles.link}
        onClick={() => {
          setMode(mode === "entrar" ? "criar" : "entrar");
          setMessage(null);
        }}
      >
        {mode === "entrar" ? "Não tem conta? Criar conta" : "Já tem conta? Entrar"}
      </button>
    </>
  );
}
