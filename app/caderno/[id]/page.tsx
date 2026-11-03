import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { getSinal } from "@/lib/sinais/dados";
import { DICIONARIOS } from "@/lib/curso/dicionarios";
import { MidiaSinal } from "@/components/caderno/MidiaSinal";
import styles from "../caderno.module.css";

export const metadata: Metadata = { title: "Sinal" };

const PARAMETROS = [
  ["hand_shape", "CM", "Configuração de mão"],
  ["location", "PA", "Ponto de articulação"],
  ["movement", "M", "Movimento"],
  ["palm_orientation", "Or", "Orientação da palma"],
  ["non_manual", "ENM", "Expressão não manual"],
] as const;

export default function SinalPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main className={styles.page}>
      <Link href="/caderno" className={styles.voltar}>
        ← Meu caderno
      </Link>
      <Suspense fallback={<div className={styles.esqueleto} aria-busy="true" />}>
        <Detalhe params={params} />
      </Suspense>
    </main>
  );
}

async function Detalhe({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await getCurrentUser())) redirect(`/login?next=/caderno/${encodeURIComponent(id)}`);
  const s = await getSinal(id);
  if (!s) notFound();
  const parametros = PARAMETROS.filter(([campo]) => s[campo]);

  return (
    <article className={styles.detalhe}>
      <header>
        <p className={styles.eyebrow}>
          {[s.kind === "frase" ? "Frase" : "Sinal", s.category, s.lesson].filter(Boolean).join(" · ")}
        </p>
        <h1 className={styles.titulo}>{s.word}</h1>
      </header>
      <MidiaSinal url={s.media_url} tipo={s.media_type} palavra={s.word} />
      {parametros.length > 0 && (
        <dl className={styles.parametrosLista}>
          {parametros.map(([campo, sigla, nome]) => (
            <div key={campo}>
              <dt>
                <abbr title={nome}>{sigla}</abbr> {nome}
              </dt>
              <dd>{s[campo]}</dd>
            </div>
          ))}
        </dl>
      )}
      {s.tip && (
        <p className={styles.dica}>
          <strong>Dica:</strong> {s.tip}
        </p>
      )}
      <div className={styles.acoes}>
        <Link href={`/caderno/${s.id}/editar`} className={styles.botaoPrincipal}>
          Editar
        </Link>
        {DICIONARIOS.map((d) => (
          <a key={d.id} href={d.link(s.word)} target="_blank" rel="noopener noreferrer" className={styles.botaoSecundario}>
            Ver no {d.nome}
          </a>
        ))}
      </div>
    </article>
  );
}
