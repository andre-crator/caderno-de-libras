import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { listarSinais } from "@/lib/sinais/dados";
import { AULAS } from "@/lib/aulas/conteudo";
import { aulasConcluidas } from "@/lib/aulas/progresso";
import { montarTrilha, paradaAtual } from "@/lib/trilha/estrelas";
import { linkGuardar } from "@/lib/curso/vocabulario";
import { DICIONARIOS } from "@/lib/curso/dicionarios";
import { missoesDaSemana, temasDaCaca } from "@/lib/jogos/caca";
import { PARES_MINIMOS, podeJogarMemoria } from "@/lib/jogos/memoria";
import { VIDEOS_MINIMOS, podeJogarRelampago } from "@/lib/jogos/relampago";
import base from "../revisar.module.css";
import styles from "./jogos.module.css";

export const metadata: Metadata = { title: "Jogos" };

export default function JogosPage() {
  return (
    <main className={base.page}>
      <header>
        <h1 className={base.titulo}>Jogos</h1>
        <p className={base.ajuda}>
          Treinar brincando, com os sinais do seu caderno.
        </p>
      </header>
      <nav className={base.modos} aria-label="Modo de revisão">
        <Link href="/revisar">Palavra → sinal</Link>
        <Link href="/revisar?modo=sinal">Sinal → palavra</Link>
        <Link href="/revisar/quiz">Quiz</Link>
        <Link href="/revisar/jogos" aria-current="page">
          Jogos
        </Link>
      </nav>
      <Suspense fallback={<div className={base.esqueleto} aria-busy="true" />}>
        <Lista />
      </Suspense>
    </main>
  );
}

function Jogo({
  href,
  titulo,
  texto,
  falta,
}: {
  href: string;
  titulo: string;
  texto: string;
  falta?: string;
}) {
  if (falta) {
    return (
      <li>
        <div className={styles.jogo} aria-disabled="true">
          <strong>{titulo}</strong>
          <span>{texto}</span>
          <span className={styles.falta}>{falta}</span>
        </div>
      </li>
    );
  }
  return (
    <li>
      <Link href={href} className={styles.jogo}>
        <strong>{titulo}</strong>
        <span>{texto}</span>
      </Link>
    </li>
  );
}

async function Lista() {
  const [sinais, progresso] = await Promise.all([
    listarSinais(),
    aulasConcluidas(),
  ]);
  if (!sinais || !progresso) redirect("/login?next=/revisar/jogos");
  const videos = sinais.filter((s) => s.media_type === "video" && s.media_url);
  const atual = paradaAtual(montarTrilha(AULAS, progresso.feitas, sinais));
  const missoes = missoesDaSemana(
    temasDaCaca(AULAS, atual?.aula.slug ?? null),
    sinais,
    new Date(),
  );
  const feitas = missoes.filter((m) => m.feita).length;
  const dicionario = DICIONARIOS[0];
  return (
    <>
      {missoes.length > 0 && (
        <section className={styles.caca} aria-labelledby="caca-titulo">
          <h2 id="caca-titulo">🔎 Caça ao sinal da semana</h2>
          <p>
            {feitas === missoes.length
              ? "Caça completa! Na segunda-feira chegam palavras novas."
              : "Pergunte à professora (ou procure no dicionário) o sinal destas palavras e guarde no caderno."}
          </p>
          <ul className={styles.missoes}>
            {missoes.map((m) => (
              <li
                key={m.palavra}
                className={styles.missao}
                data-feita={m.feita ? "" : undefined}
              >
                <span aria-hidden="true">{m.feita ? "✅" : "○"}</span>
                <div>
                  <strong>{m.palavra}</strong>
                  <small>
                    {m.tema} ·{" "}
                    <a
                      href={dicionario.link(m.palavra)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ver no {dicionario.nome}
                    </a>
                  </small>
                </div>
                {m.feita ? (
                  <span className={styles.feita}>Feita</span>
                ) : (
                  <Link
                    href={linkGuardar(m.palavra, m.tema)}
                    className={styles.guardar}
                  >
                    Guardar
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
      <ul className={styles.lista}>
        <Jogo
          href="/aulas"
          titulo="★ Trilha de estrelas"
          texto="Cada aula do curso vale 3 estrelas."
        />
        <Jogo
          href="/revisar/memoria"
          titulo="🃏 Jogo da memória"
          texto="Ache os pares: o sinal e a palavra dele."
          falta={
            podeJogarMemoria(sinais)
              ? undefined
              : `Precisa de ${PARES_MINIMOS} sinais com foto ou vídeo.`
          }
        />
        <Jogo
          href="/revisar/relampago"
          titulo="⚡ Sinal relâmpago"
          texto="O vídeo fica cada vez mais rápido. Até onde você vai?"
          falta={
            podeJogarRelampago(videos, sinais)
              ? undefined
              : `Precisa de ${VIDEOS_MINIMOS} sinais com vídeo (você tem ${videos.length}).`
          }
        />
        <Jogo
          href="/revisar/espelho"
          titulo="🪞 Desafio do espelho"
          texto="Faça o sinal, grave e compare com o do caderno. Dá para jogar em dupla."
          falta={
            sinais.some((s) => s.media_url)
              ? undefined
              : "Precisa de 1 sinal com foto ou vídeo."
          }
        />
      </ul>
    </>
  );
}
