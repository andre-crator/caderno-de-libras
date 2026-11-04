"use client";
// Cartão "Meta da semana" do Início: bolinhas de segunda a domingo, sequência de
// semanas, escolha da meta e o lembrete diário (notificação no celular).
import { useState } from "react";
import { useRouter } from "next/navigation";
import { definirMeta } from "@/lib/meta/acoes";
import { LETRAS_DIAS, METAS, type Semana } from "@/lib/meta/semana";
import { Lembrete } from "./Lembrete";
import styles from "./meta.module.css";

const NOMES_DIAS = ["segunda", "terça", "quarta", "quinta", "sexta", "sábado", "domingo"];

export function CartaoMeta({ semana }: { semana: Semana }) {
  const router = useRouter();
  const [mudando, setMudando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(false);
  const { dias, hoje, feitos, meta, cumpriu, sequencia } = semana;

  async function escolher(n: number) {
    if (n === meta) return setMudando(false);
    setSalvando(true);
    setErro(false);
    const r = await definirMeta(n).catch(() => ({ ok: false }));
    setSalvando(false);
    if (!r.ok) return setErro(true);
    setMudando(false);
    router.refresh();
  }

  return (
    <section className={styles.cartao} aria-labelledby="meta-titulo">
      <div className={styles.cabecalho}>
        <h2 id="meta-titulo">Meta da semana</h2>
        <span className={styles.contagem}>
          <strong>{Math.min(feitos, 7)}</strong> de {meta} dias
        </span>
      </div>
      <ol className={styles.dias} aria-label="Dias estudados nesta semana">
        {dias.map((estudou, i) => (
          <li
            key={i}
            data-estudou={estudou ? "" : undefined}
            data-hoje={i === hoje ? "" : undefined}
            aria-label={`${NOMES_DIAS[i]}${i === hoje ? " (hoje)" : ""}: ${estudou ? "estudou" : i > hoje ? "ainda vem" : "não estudou"}`}
          >
            <span aria-hidden="true">{estudou ? "✓" : LETRAS_DIAS[i]}</span>
          </li>
        ))}
      </ol>
      <p className={styles.frase}>
        {cumpriu
          ? sequencia > 1
            ? `Meta cumprida! São ${sequencia} semanas seguidas. 🎉`
            : "Meta cumprida nesta semana! 🎉"
          : dias[hoje]
            ? `Hoje já conta. Faltam ${meta - feitos} ${meta - feitos === 1 ? "dia" : "dias"} na semana.`
            : sequencia > 0
              ? `Você vem de ${sequencia} ${sequencia === 1 ? "semana" : "semanas"} com a meta. Bora manter!`
              : "Qualquer revisão, jogo ou sinal guardado conta como dia estudado."}
      </p>

      {mudando ? (
        <div className={styles.metas} role="group" aria-label="Quantos dias por semana?">
          {METAS.map((n) => (
            <button key={n} type="button" aria-pressed={n === meta} disabled={salvando} onClick={() => escolher(n)}>
              {n} dias
            </button>
          ))}
        </div>
      ) : (
        <button type="button" className={styles.link} onClick={() => setMudando(true)}>
          Mudar a meta
        </button>
      )}
      {erro && (
        <p role="alert" className={styles.erro}>
          Não deu para salvar. Confira a internet e tente de novo.
        </p>
      )}
      <Lembrete />
    </section>
  );
}
