"use client";
// Quiz: mídia do sinal + 4 palavras. Acertou: segue. Errou: mostra a certa e o
// sinal volta para a revisão de hoje (responderCartao "errei").
import { useState } from "react";
import { useRouter } from "next/navigation";
import { responderCartao } from "@/lib/revisao/acoes";
import { registrarEstudo } from "@/lib/meta/acoes";
import type { Pergunta } from "@/lib/revisao/quiz";
import type { Sinal } from "@/lib/sinais/dados";
import { MidiaSinal } from "@/components/caderno/MidiaSinal";
import styles from "@/app/revisar/revisar.module.css";

export function Quiz({ perguntas }: { perguntas: Pergunta<Sinal>[] }) {
  const router = useRouter();
  const [pos, setPos] = useState(0);
  const [escolha, setEscolha] = useState<string | null>(null);
  const [acertos, setAcertos] = useState(0);

  if (pos >= perguntas.length) {
    const total = perguntas.length;
    return (
      <div className={styles.vazio}>
        <h2>
          {acertos} de {total}
        </h2>
        <p>
          {acertos === total
            ? "Acertou tudo! Seu olho está ficando treinado."
            : "Os que você errou voltaram para a revisão de hoje."}
        </p>
        <div className={styles.acoes}>
          <button type="button" className={styles.botaoPrincipal} onClick={() => router.refresh()}>
            Outro quiz
          </button>
          {acertos < total && (
            <a href="/revisar" className={styles.botaoSecundario}>
              Revisar agora
            </a>
          )}
        </div>
      </div>
    );
  }

  const { item, opcoes } = perguntas[pos];
  const respondeu = escolha !== null;

  function escolher(palavra: string) {
    if (respondeu) return;
    setEscolha(palavra);
    if (palavra === item.word) setAcertos((n) => n + 1);
    else void responderCartao(item.id, "errei").catch(() => {});
  }

  return (
    <section className={styles.sessao} aria-label="Pergunta do quiz">
      <div className={styles.progresso}>
        <span>
          {pos + 1} de {perguntas.length}
        </span>
        <span className={styles.barra} aria-hidden="true">
          <span style={{ width: `${Math.round((pos / perguntas.length) * 100)}%` }} />
        </span>
      </div>
      <div className={styles.cartao}>
        <p className={styles.eyebrow}>Que sinal é este?</p>
        <MidiaSinal key={item.id} url={item.media_url} tipo={item.media_type} palavra="este sinal" />
      </div>
      <div className={styles.opcoes} role="group" aria-label="Escolha a palavra">
        {opcoes.map((o) => {
          const estado = !respondeu ? undefined : o === item.word ? "certa" : o === escolha ? "errada" : "neutra";
          return (
            <button key={o} type="button" data-estado={estado} onClick={() => escolher(o)} disabled={respondeu && estado === "neutra"}>
              {o}
            </button>
          );
        })}
      </div>
      {respondeu && (
        <>
          <p className={styles.feedback} role="status">
            {escolha === item.word ? "Isso! ✓" : `Era “${item.word}”. Ele volta na revisão de hoje.`}
          </p>
          <button
            type="button"
            className={`${styles.botaoPrincipal} ${styles.largo}`}
            onClick={() => {
              if (pos + 1 >= perguntas.length) void registrarEstudo().catch(() => {});
              setEscolha(null);
              setPos((p) => p + 1);
            }}
          >
            {pos + 1 < perguntas.length ? "Próxima" : "Ver resultado"}
          </button>
        </>
      )}
    </section>
  );
}
