import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { listarPalavras } from "@/lib/sinais/dados";
import { UNIDADES, rotuloUnidade } from "@/lib/curso/unidades";
import { TEMAS_EXTRA, VOCABULARIO, linkGuardar, listaDoTema } from "@/lib/curso/vocabulario";
import { DICIONARIOS } from "@/lib/curso/dicionarios";
import styles from "../caderno.module.css";

export const metadata: Metadata = { title: "Listas de estudo" };

export default function TemasPage() {
  return (
    <main className={styles.page}>
      <Link href="/caderno" className={styles.voltar}>
        ← Meu caderno
      </Link>
      <header>
        <h1 className={styles.titulo}>Listas de estudo</h1>
        <p className={styles.ajuda}>
          Palavras de cada tema do curso. Toque em “ver o sinal” para conferir num dicionário e em “guardar”
          quando aprender, com a sua foto ou vídeo. Sinais variam por região: vale o que a professora ensinou.
        </p>
      </header>
      <Suspense fallback={<div className={styles.esqueleto} aria-busy="true" />}>
        <Listas />
      </Suspense>
    </main>
  );
}

async function Listas() {
  const palavras = await listarPalavras();
  if (!palavras) redirect("/login?next=/caderno/temas");
  const dicionario = DICIONARIOS[0];

  return (
    <div className={styles.unidades}>
      <section className={styles.unidade}>
        <h2>Para conversar</h2>
        {TEMAS_EXTRA.map((tema) => {
          const lista = listaDoTema(tema, palavras);
          const feitas = lista.filter((i) => i.guardada).length;
          return (
            <details key={tema} className={styles.tema} open={feitas < lista.length}>
              <summary>
                <span>{tema}</span>
                <span className={styles.progresso}>
                  {feitas} de {lista.length}
                </span>
                <span className={styles.barraTema} aria-hidden="true">
                  <span style={{ width: `${Math.round((feitas / lista.length) * 100)}%` }} />
                </span>
              </summary>
              <ul className={styles.palavras}>
                {lista.map((item) => (
                  <li key={item.palavra} data-guardada={item.guardada ? "" : undefined}>
                    <span className={styles.palavra}>
                      {item.guardada && <span aria-label="já guardada">✓ </span>}
                      {item.palavra}
                    </span>
                    {!item.guardada && <Link href={linkGuardar(item.palavra, tema)}>guardar</Link>}
                  </li>
                ))}
              </ul>
            </details>
          );
        })}
      </section>
      {UNIDADES.map((u) => {
        const temas = u.temas.filter((t) => VOCABULARIO[t]);
        if (temas.length === 0) return null;
        return (
          <section key={u.numero} className={styles.unidade}>
            <h2>{rotuloUnidade(u.numero)}</h2>
            {temas.map((tema) => {
              const lista = listaDoTema(tema, palavras);
              const feitas = lista.filter((i) => i.guardada).length;
              return (
                <details key={tema} className={styles.tema}>
                  <summary>
                    <span>{tema}</span>
                    <span className={styles.progresso}>
                      {feitas} de {lista.length}
                    </span>
                    <span className={styles.barraTema} aria-hidden="true">
                      <span style={{ width: `${Math.round((feitas / lista.length) * 100)}%` }} />
                    </span>
                  </summary>
                  <ul className={styles.palavras}>
                    {lista.map((item) => (
                      <li key={item.palavra} data-guardada={item.guardada ? "" : undefined}>
                        <span className={styles.palavra}>
                          {item.guardada && <span aria-label="já guardada">✓ </span>}
                          {item.palavra}
                        </span>
                        <a href={dicionario.link(item.palavra)} target="_blank" rel="noopener noreferrer">
                          ver o sinal
                        </a>
                        {!item.guardada && (
                          <Link href={linkGuardar(item.palavra, tema)}>
                            guardar
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </details>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
