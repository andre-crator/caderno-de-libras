"use client";
// Sessão de revisão: um cartão por vez. "Errei" devolve o cartão ao fim da fila.
// Cada resposta é gravada na hora (se a internet cair, a sessão continua e avisa).

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { responderCartao } from "@/lib/revisao/acoes";
import { INTERVALOS_DIAS, NIVEL_MAXIMO, type Resposta } from "@/lib/revisao/agenda";
import { type ModoRevisao, reenfileirar } from "@/lib/revisao/fila";
import type { Sinal } from "@/lib/sinais/dados";
import { MidiaSinal } from "@/components/caderno/MidiaSinal";
import styles from "@/app/revisar/revisar.module.css";

type Props = { cartoes: Sinal[]; modo: ModoRevisao; todos: boolean };

export function Revisao({ cartoes, modo, todos }: Props) {
  const router = useRouter();
  const [fila, setFila] = useState(cartoes);
  const [pos, setPos] = useState(0);
  const [virado, setVirado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [falhouGravar, setFalhouGravar] = useState(false);
  const [jaVoltou, setJaVoltou] = useState<Set<string>>(new Set());

  if (cartoes.length === 0) {
    return (
      <div className={styles.vazio}>
        <h2>{todos ? "Nada para treinar" : "Tudo em dia!"}</h2>
        <p>
          {modo === "sinal" && !todos
            ? "Nenhum cartão com foto ou vídeo para revisar agora."
            : todos
              ? "Guarde alguns sinais no caderno para treinar aqui."
              : "Nenhum sinal para revisar agora. Volte amanhã ou treine todos mesmo assim."}
        </p>
        <div className={styles.acoes}>
          {!todos && (
            <Link href={`/revisar?todos=1${modo === "sinal" ? "&modo=sinal" : ""}`} className={styles.botaoPrincipal}>
              Treinar todos
            </Link>
          )}
          <Link href="/caderno" className={styles.botaoSecundario}>
            Abrir o caderno
          </Link>
        </div>
      </div>
    );
  }

  if (pos >= fila.length) {
    return (
      <div className={styles.vazio}>
        <h2>Sessão concluída</h2>
        <p>
          Você revisou {cartoes.length} {cartoes.length === 1 ? "cartão" : "cartões"} e acertou {acertos} de primeira.
          Os que você acertou voltam daqui a alguns dias.
        </p>
        {falhouGravar && <p className={styles.aviso}>Algumas respostas não foram salvas por falta de internet.</p>}
        <div className={styles.acoes}>
          <button type="button" className={styles.botaoPrincipal} onClick={() => router.refresh()}>
            Revisar de novo
          </button>
          <Link href="/painel" className={styles.botaoSecundario}>
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  const c = fila[pos];
  const nivel = Math.min(NIVEL_MAXIMO, c.review_level + 1);
  const detalhes = [c.hand_shape, c.location, c.movement, c.palm_orientation, c.non_manual].filter(Boolean);

  async function responder(r: Resposta) {
    if (enviando) return;
    setEnviando(true);
    let res: { ok: boolean };
    try {
      res = await responderCartao(c.id, r);
    } catch {
      res = { ok: false }; // sem internet: a sessão continua e avisa no fim
    } finally {
      setEnviando(false);
    }
    if (!res.ok) setFalhouGravar(true);
    if (r === "acertei" && res.ok && !jaVoltou.has(c.id)) setAcertos((n) => n + 1);
    if (r === "errei" && !jaVoltou.has(c.id)) {
      setFila((f) => reenfileirar(f, pos));
      setJaVoltou((s) => new Set(s).add(c.id));
    }
    setVirado(false);
    setPos((p) => p + 1);
  }

  const frente =
    modo === "palavra" ? (
      <p className={styles.palavra}>{c.word}</p>
    ) : (
      <MidiaSinal url={c.media_url} tipo={c.media_type} palavra="este sinal" />
    );
  const verso =
    modo === "palavra" ? (
      <>
        <MidiaSinal url={c.media_url} tipo={c.media_type} palavra={c.word} />
        {detalhes.length > 0 && (
          <ul className={styles.detalhes}>
            {detalhes.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        )}
      </>
    ) : (
      <p className={styles.palavra}>{c.word}</p>
    );

  return (
    <section className={styles.sessao} aria-label="Cartão de revisão">
      <div className={styles.progresso}>
        <span>
          {pos + 1} de {fila.length}
        </span>
        <span className={styles.barra} aria-hidden="true">
          <span style={{ width: `${Math.round((pos / fila.length) * 100)}%` }} />
        </span>
      </div>

      <div className={styles.cartao}>
        <p className={styles.eyebrow}>
          {modo === "palavra" ? "Faça o sinal de" : "Que sinal é este?"}
          {c.category ? ` · ${c.category}` : ""}
        </p>
        {frente}
        {virado && <div className={styles.verso}>{verso}</div>}
        {virado && c.tip && (
          <p className={styles.dica}>
            <strong>Dica:</strong> {c.tip}
          </p>
        )}
      </div>

      {!virado ? (
        <button type="button" className={`${styles.botaoPrincipal} ${styles.largo}`} onClick={() => setVirado(true)}>
          {modo === "palavra" ? "Fiz o sinal. Mostrar" : "Mostrar a palavra"}
        </button>
      ) : (
        <div className={styles.notas} role="group" aria-label="Como foi?">
          <button type="button" className={styles.errei} onClick={() => responder("errei")} disabled={enviando}>
            Errei
            <small>volta já</small>
          </button>
          <button type="button" className={styles.duvida} onClick={() => responder("duvida")} disabled={enviando}>
            Com dúvida
            <small>amanhã</small>
          </button>
          <button type="button" className={styles.acertei} onClick={() => responder("acertei")} disabled={enviando}>
            Acertei
            <small>
              em {INTERVALOS_DIAS[nivel]} {INTERVALOS_DIAS[nivel] === 1 ? "dia" : "dias"}
            </small>
          </button>
        </div>
      )}
    </section>
  );
}
