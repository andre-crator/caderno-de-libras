import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { aulasPorUnidade } from "@/lib/aulas/aulas";
import { AULAS } from "@/lib/aulas/conteudo";
import { listarResumoSinais } from "@/lib/sinais/dados";
import { montarTrilha, paradaAtual } from "@/lib/trilha/estrelas";
import { aulasConcluidas } from "@/lib/aulas/progresso";
import { rotuloUnidade } from "@/lib/curso/unidades";
import styles from "./aulas.module.css";

export const metadata: Metadata = { title: "Trilha" };

export default function AulasPage() {
  return (
    <main className={styles.page}>
      <Link href="/painel" className={styles.voltar}>
        ← Início
      </Link>
      <header>
        <h1 className={styles.titulo}>Sua trilha</h1>
        <p className={styles.ajuda}>
          Cada parada é uma aula do curso. Assista, guarde os sinais e revise para ganhar as 3 estrelas.
        </p>
      </header>
      <Suspense fallback={<div className={styles.esqueleto} aria-busy="true" />}>
        <Lista />
      </Suspense>
    </main>
  );
}

async function Lista() {
  const [progresso, sinais] = await Promise.all([aulasConcluidas(), listarResumoSinais()]);
  if (!progresso || !sinais) redirect("/login?next=/aulas");
  const trilha = montarTrilha(AULAS, progresso.feitas, sinais);
  const atual = paradaAtual(trilha);
  const totalEstrelas = trilha.reduce((n, p) => n + p.total, 0);

  return (
    <div className={styles.trilhaPagina}>
      {progresso.erro && (
        <p className={styles.aviso} role="status">
          Não deu para carregar quais aulas você já concluiu. Confira a internet e abra de novo.
        </p>
      )}
      <div className={styles.resumoTrilha}>
        <span>
          <strong>{totalEstrelas}</strong> de {trilha.length * 3} estrelas
        </span>
        {atual && (
          <Link href={`/aulas/${atual.aula.slug}`} className={styles.botaoPrincipalPeq}>
            Continuar: {atual.aula.titulo}
          </Link>
        )}
      </div>
      <details className={styles.legenda}>
        <summary>Como ganhar estrelas</summary>
        <ul>
          <li>★ Assista à aula e toque em “Concluí esta aula”.</li>
          <li>★ Guarde 3 sinais do tema da aula no caderno.</li>
          <li>★ Acerte esses 3 sinais na revisão em dias diferentes.</li>
        </ul>
        <p>As paradas seguem a ordem do curso. Pode abrir qualquer uma, até as que você já teve na aula.</p>
      </details>

      {aulasPorUnidade().map(({ unidade, aulas }) => (
        <section key={unidade} className={styles.unidadeTrilha} aria-label={rotuloUnidade(unidade)}>
          <h2>{rotuloUnidade(unidade)}</h2>
          <ol className={styles.caminho}>
            {aulas.map((a) => {
              const p = trilha.find((x) => x.aula.slug === a.slug)!;
              const i = AULAS.indexOf(a);
              const lado = ["esq", "meio", "dir", "meio"][i % 4];
              const eAtual = atual?.aula.slug === a.slug;
              const conteudo = (
                <>
                  <span className={styles.bolha} data-estado={eAtual ? "atual" : p.total === 3 ? "completa" : p.total > 0 ? "aberta" : "fechada"}>
                    {p.total === 3 ? "★" : String(i + 1)}
                  </span>
                  <span className={styles.estrelas} aria-label={`${p.total} de 3 estrelas`}>
                    {"★".repeat(p.total)}
                    <span className={styles.apagada}>{"★".repeat(3 - p.total)}</span>
                  </span>
                  <span className={styles.nomeParada}>{a.titulo}</span>
                  {eAtual && <span className={styles.aqui}>você está aqui</span>}
                </>
              );
              return (
                <li key={a.slug} className={styles.parada} data-lado={lado}>
                  <Link href={`/aulas/${a.slug}`} className={styles.paradaLink}>
                    {conteudo}
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
      <p className={styles.ajuda}>As próximas unidades entram na trilha conforme o curso avança.</p>
    </div>
  );
}
