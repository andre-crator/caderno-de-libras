import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/routes";
import { LoginForm } from "./LoginForm";
import styles from "./login.module.css";

export const metadata: Metadata = { title: "Entrar" };

type SearchParams = Promise<{ next?: string; erro?: string }>;

// Padrão do Next.js 16 (Cache Components): a "casca" (cartão e título) é
// estática e aparece na hora; o que depende da requisição (cookies e parâmetros
// da URL) fica dentro do <Suspense> e chega logo em seguida.
export default function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Entrar</h1>
        <Suspense fallback={<div className={styles.skeleton} aria-busy="true" />}>
          <LoginContent searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

async function LoginContent({ searchParams }: { searchParams: SearchParams }) {
  const { next, erro } = await searchParams;
  const nextPath = safeNextPath(next);

  // Já está logado? Vai direto para o app.
  if (await getCurrentUser()) redirect(nextPath);

  return (
    <>
      {erro === "callback" && (
        <p className={styles.error} role="alert">
          Não foi possível concluir o login. Tente novamente.
        </p>
      )}
      {erro === "confirmacao" && (
        <p className={styles.error} role="alert">
          O link de confirmação expirou ou já foi usado. Entre com seu e-mail e senha ou
          peça um novo cadastro.
        </p>
      )}
      <LoginForm nextPath={nextPath} />
    </>
  );
}
