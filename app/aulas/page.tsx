import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { aulasPorUnidade } from "@/lib/aulas/aulas";
import { aulasConcluidas } from "@/lib/aulas/progresso";
import { rotuloUnidade } from "@/lib/curso/unidades";
import styles from "./aulas.module.css";

export const metadata: Metadata = { title: "Aulas" };

export default function AulasPage() {
  return (
    <main className={styles.page}>
      <Link href="/painel" className={styles.voltar}>
        ← Início
      </Link>
      <header>
        <h1 className={styles.titulo}>Aulas</h1>
        <p className={styles.ajuda}>
          Uma aula por tema do curso, com explicação curta e vídeos. Assista, guarde os sinais no caderno e marque como
          concluída.
        </p>
      </header>
      <Suspense fallback={<div className={styles.esqueleto} aria-busy="true" />}>
        <Lista />
      </Suspense>
    </main>
  );
}

async function Lista() {
  const progresso = await aulasConcluidas();
  if (!progresso) redirect("/login?next=/aulas");
  const { feitas } = progresso;
  return (
    <div className={styles.unidades}>
      {progresso.erro && (
        <p className={styles.aviso} role="status">
          Não deu para carregar quais aulas você já concluiu. Confira a internet e abra de novo.
        </p>
      )}
      {aulasPorUnidade().map(({ unidade, aulas }) => {
        const n = aulas.filter((a) => feitas.has(a.slug)).length;
        return (
          <section key={unidade} className={styles.unidade}>
            <h2>
              {rotuloUnidade(unidade)}
              <span className={styles.contagem}>
                {n} de {aulas.length}
              </span>
            </h2>
            <ol className={styles.listaAulas}>
              {aulas.map((a) => (
                <li key={a.slug}>
                  <Link href={`/aulas/${a.slug}`} className={styles.itemAula} data-feita={feitas.has(a.slug) ? "" : undefined}>
                    <span className={styles.marca} aria-label={feitas.has(a.slug) ? "concluída" : "não concluída"}>
                      {feitas.has(a.slug) ? "✓" : ""}
                    </span>
                    <span>
                      <strong>{a.titulo}</strong>
                      <small>{a.objetivo}</small>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        );
      })}
      <p className={styles.ajuda}>As próximas unidades entram conforme o curso avança.</p>
    </div>
  );
}
