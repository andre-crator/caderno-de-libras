import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { rotuloUnidade, unidadeDoTema } from "@/lib/curso/unidades";
import { FormSinal } from "@/components/caderno/FormSinal";
import styles from "../caderno.module.css";

export const metadata: Metadata = { title: "Guardar sinal" };

type SearchParams = Promise<{ palavra?: string; tema?: string; tipo?: string }>;

export default function NovoSinalPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className={styles.page}>
      <Link href="/caderno" className={styles.voltar}>
        ← Meu caderno
      </Link>
      <h1 className={styles.titulo}>Guardar sinal</h1>
      <Suspense fallback={<div className={styles.esqueleto} aria-busy="true" />}>
        <Conteudo searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function Conteudo({ searchParams }: { searchParams: SearchParams }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/caderno/novo");
  const { palavra = "", tema = "", tipo = "" } = await searchParams;
  const unidade = tema ? unidadeDoTema(tema) : null;
  return (
    <FormSinal
      userId={user.id}
      inicial={{
        kind: tipo === "frase" ? "frase" : "sinal",
        word: palavra.slice(0, 120),
        category: tema.slice(0, 40),
        lesson: unidade ? rotuloUnidade(unidade) : "",
      }}
    />
  );
}
