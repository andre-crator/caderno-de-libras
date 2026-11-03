// Exemplo de página PRIVADA. O proxy.ts já barra quem não está logado,
// mas a página confere de novo: defesa em camadas (se alguém mudar o proxy,
// a página continua protegida).
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import styles from "./painel.module.css";

export const metadata: Metadata = { title: "Início" };

// Áreas do app. Sem `href` = ainda não existe ("em breve"), conforme docs/PLANO_FASE1.md.
const AREAS: { titulo: string; texto: string; href?: string }[] = [
  { titulo: "Meu caderno", texto: "Sinais e frases de cada aula, com foto ou vídeo." },
  { titulo: "Revisar", texto: "Cartões de 10 a 15 minutos para não esquecer." },
  { titulo: "Soletrar", texto: "Treino do alfabeto manual e dos números.", href: "/soletrar" },
];

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
      <ul className={styles.areas}>
        {AREAS.map((a) => (
          <li key={a.titulo} className={styles.area} data-breve={!a.href ? "" : undefined}>
            {a.href ? (
              <Link href={a.href} className={styles.link}>
                {a.titulo}
              </Link>
            ) : (
              <strong>{a.titulo}</strong>
            )}
            <span>{a.texto}</span>
            {!a.href && <em className={styles.breve}>em breve</em>}
          </li>
        ))}
      </ul>
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
