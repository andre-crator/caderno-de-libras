import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { listarParaRevisar } from "@/lib/sinais/dados";
import { type ModoRevisao, montarFila } from "@/lib/revisao/fila";
import { Revisao } from "@/components/revisar/Revisao";
import styles from "./revisar.module.css";

export const metadata: Metadata = { title: "Revisar" };

type SearchParams = Promise<{ modo?: string; todos?: string }>;

export default function RevisarPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className={styles.page}>
      <Link href="/painel" className={styles.voltar}>
        ← Início
      </Link>
      <header>
        <h1 className={styles.titulo}>Revisar</h1>
        <p className={styles.ajuda}>
          Faça o sinal (ou diga a palavra) antes de virar o cartão. Os que você erra voltam no fim e de novo amanhã.
        </p>
      </header>
      <Suspense fallback={<div className={styles.esqueleto} aria-busy="true" />}>
        <Sessao searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function Sessao({ searchParams }: { searchParams: SearchParams }) {
  const { modo: m, todos: t } = await searchParams;
  const modo: ModoRevisao = m === "sinal" ? "sinal" : "palavra";
  const todos = t === "1";
  const sinais = await listarParaRevisar(todos, modo === "sinal");
  if (!sinais) redirect("/login?next=/revisar");
  const fila = montarFila(sinais, new Date(), { modo, todos });

  return (
    <>
      <nav className={styles.modos} aria-label="Modo de revisão">
        <Link href={`/revisar${todos ? "?todos=1" : ""}`} aria-current={modo === "palavra" ? "page" : undefined}>
          Palavra → sinal
        </Link>
        <Link href={`/revisar?modo=sinal${todos ? "&todos=1" : ""}`} aria-current={modo === "sinal" ? "page" : undefined}>
          Sinal → palavra
        </Link>
        <Link href="/revisar/quiz">Quiz</Link>
      </nav>
      {/* key: trocar de modo ou receber cartões novos (ex.: "revisar de novo") começa outra sessão */}
      <Revisao
        key={`${modo}-${todos}-${fila.map((c) => `${c.id}:${c.review_due_at}`).join(",")}`}
        cartoes={fila}
        modo={modo}
        todos={todos}
      />
    </>
  );
}
