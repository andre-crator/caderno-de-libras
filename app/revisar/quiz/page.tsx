import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { listarSinais } from "@/lib/sinais/dados";
import { montarQuiz, podeFazerQuiz } from "@/lib/revisao/quiz";
import { Quiz } from "@/components/revisar/Quiz";
import styles from "../revisar.module.css";

export const metadata: Metadata = { title: "Quiz" };

export default function QuizPage() {
  return (
    <main className={styles.page}>
      <header>
        <h1 className={styles.titulo}>Quiz</h1>
        <p className={styles.ajuda}>
          Veja o sinal e escolha a palavra. Use a câmera lenta e o “repetir” à vontade: é assim que se treina entender
          quem sinaliza rápido.
        </p>
      </header>
      <nav className={styles.modos} aria-label="Modo de revisão">
        <Link href="/revisar">Palavra → sinal</Link>
        <Link href="/revisar?modo=sinal">Sinal → palavra</Link>
        <Link href="/revisar/quiz" aria-current="page">
          Quiz
        </Link>
        <Link href="/revisar/jogos">Jogos</Link>
      </nav>
      <Suspense fallback={<div className={styles.esqueleto} aria-busy="true" />}>
        <Conteudo />
      </Suspense>
    </main>
  );
}

async function Conteudo() {
  const sinais = await listarSinais();
  if (!sinais) redirect("/login?next=/revisar/quiz");
  if (!podeFazerQuiz(sinais)) {
    return (
      <div className={styles.vazio}>
        <h2>Quase lá!</h2>
        <p>
          O quiz precisa de pelo menos 4 palavras no caderno, e de sinais com foto ou vídeo. Você tem {sinais.length}{" "}
          {sinais.length === 1 ? "sinal" : "sinais"}.
        </p>
        <div className={styles.acoes}>
          <Link href="/caderno/novo" className={styles.botaoPrincipal}>
            Guardar sinal
          </Link>
        </div>
      </div>
    );
  }
  const perguntas = montarQuiz(sinais);
  return <Quiz key={perguntas.map((p) => p.item.id).join(",")} perguntas={perguntas} />;
}
