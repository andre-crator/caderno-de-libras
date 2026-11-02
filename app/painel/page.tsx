// Exemplo de página PRIVADA. O proxy.ts já barra quem não está logado,
// mas a página confere de novo: defesa em camadas (se alguém mudar o proxy,
// a página continua protegida).
import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import styles from "./painel.module.css";

export const metadata: Metadata = { title: "Painel" };

// A casca (layout da página e botão Sair) é estática; os dados do usuário
// chegam dentro do <Suspense>, que mostra um esqueleto enquanto carrega.
export default function PainelPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Suspense fallback={<div className={styles.skeletonTitle} aria-busy="true" />}>
          <Saudacao />
        </Suspense>
        <form action="/auth/signout" method="post">
          <button type="submit" className={styles.button}>
            Sair
          </button>
        </form>
      </header>
      <p>Comece o seu app a partir daqui.</p>
    </main>
  );
}

async function Saudacao() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/painel");

  // A RLS garante que esta consulta só devolve o perfil do próprio usuário.
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div>
      <h1 className={styles.title}>Olá{profile?.full_name ? `, ${profile.full_name}` : ""}!</h1>
      <p className={styles.muted}>Logado como {user.email}</p>
    </div>
  );
}
