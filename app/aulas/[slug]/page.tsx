import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { buscaNoYoutube, getAula, videosDaAula, vizinhas } from "@/lib/aulas/aulas";
import { aulasConcluidas } from "@/lib/aulas/progresso";
import { listarPalavras } from "@/lib/sinais/dados";
import { TEMAS_EXTRA, linkGuardar, listaDoTema } from "@/lib/curso/vocabulario";
import { DICIONARIOS } from "@/lib/curso/dicionarios";
import { rotuloUnidade } from "@/lib/curso/unidades";
import { PlayerYoutube } from "@/components/aulas/PlayerYoutube";
import { BotaoConcluir } from "@/components/aulas/BotaoConcluir";
import { Texto } from "@/components/aulas/Texto";
import styles from "../aulas.module.css";

export const metadata: Metadata = { title: "Aula" };

type Params = Promise<{ slug: string }>;

export default function AulaPage({ params }: { params: Params }) {
  return (
    <main className={styles.page}>
      <Link href="/aulas" className={styles.voltar}>
        ← Aulas
      </Link>
      <Suspense fallback={<div className={styles.esqueleto} aria-busy="true" />}>
        <Conteudo params={params} />
      </Suspense>
    </main>
  );
}

async function Conteudo({ params }: { params: Params }) {
  const { slug } = await params;
  const aula = getAula(slug);
  if (!aula) notFound();
  const [progresso, palavras] = await Promise.all([aulasConcluidas(), listarPalavras()]);
  if (!progresso || !palavras) redirect(`/login?next=/aulas/${slug}`);
  const { feitas } = progresso;
  const videos = videosDaAula(slug);
  const { anterior, proxima } = vizinhas(slug);
  const dicionario = DICIONARIOS[0];

  return (
    <article className={styles.aula}>
      <header>
        <p className={styles.eyebrow}>{rotuloUnidade(aula.unidade)}</p>
        <h1 className={styles.titulo}>{aula.titulo}</h1>
        <p className={styles.objetivo}>
          <strong>Nesta aula:</strong> {aula.objetivo}
        </p>
      </header>

      {aula.secoes.map((s) => (
        <section key={s.titulo} className={styles.secao}>
          <h2>{s.titulo}</h2>
          {s.paragrafos.map((p) => (
            <p key={p}>
              <Texto>{p}</Texto>
            </p>
          ))}
          {s.itens && (
            <ul>
              {s.itens.map((i) => (
                <li key={i}>
                  <Texto>{i}</Texto>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <section className={styles.secao}>
        <h2>Vídeos</h2>
        <p className={styles.ajuda}>
          Sinais variam por região: se um vídeo mostrar um sinal diferente do da sua professora, vale o da professora.
        </p>
        {videos.map((v) => (
          <PlayerYoutube key={v.id} video={v} />
        ))}
        <a href={buscaNoYoutube(aula.titulo)} target="_blank" rel="noopener noreferrer" className={styles.linkMais}>
          Procurar mais vídeos sobre “{aula.titulo}” no YouTube
        </a>
      </section>

      {(aula.temas.length > 0 || aula.soletrar) && (
        <section className={styles.secao}>
          <h2>Pratique</h2>
          {aula.soletrar && (
            <p>
              <Link href="/soletrar" className={styles.botaoSecundario}>
                Treinar {aula.soletrar === "numeros" ? "números" : "o alfabeto"} no Soletrar
              </Link>
            </p>
          )}
          {aula.temas.map((tema) => {
            const lista = listaDoTema(tema, palavras);
            return (
              <div key={tema} className={styles.pratique}>
                <h3>
                  {tema}{" "}
                  <span className={styles.contagem}>
                    {lista.filter((i) => i.guardada).length} de {lista.length} no caderno
                  </span>
                </h3>
                <ul className={styles.palavras}>
                  {lista.map((item) => (
                    <li key={item.palavra} data-guardada={item.guardada ? "" : undefined}>
                      <span className={styles.palavra}>
                        {item.guardada && <span aria-label="já guardada">✓ </span>}
                        {item.palavra}
                      </span>
                      {!(TEMAS_EXTRA as readonly string[]).includes(tema) && (
                        <a href={dicionario.link(item.palavra)} target="_blank" rel="noopener noreferrer">
                          ver o sinal
                        </a>
                      )}
                      {!item.guardada && (
                        <Link href={linkGuardar(item.palavra, tema)}>
                          guardar
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
      )}

      {progresso.erro && (
        <p className={styles.aviso} role="status">
          Não deu para carregar quais aulas você já concluiu. Confira a internet e abra de novo.
        </p>
      )}
      <BotaoConcluir slug={aula.slug} concluida={feitas.has(aula.slug)} />

      <nav className={styles.navAulas} aria-label="Outras aulas">
        {anterior ? (
          <Link href={`/aulas/${anterior.slug}`}>← {anterior.titulo}</Link>
        ) : (
          <span />
        )}
        {proxima && <Link href={`/aulas/${proxima.slug}`}>{proxima.titulo} →</Link>}
      </nav>
    </article>
  );
}
