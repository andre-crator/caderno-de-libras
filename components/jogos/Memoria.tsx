"use client";
// Jogo da memória: vira duas cartas; par = mídia do sinal + a palavra dele.
// Erros não mexem na revisão sozinhos: no fim ela escolhe mandar os difíceis.
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { responderCartao } from "@/lib/revisao/acoes";
import { type Carta, formamPar, formatarTempo, paresDificeis } from "@/lib/jogos/memoria";
import type { Sinal } from "@/lib/sinais/dados";
import { VideoPausavel } from "@/components/VideoPausavel";
import base from "@/app/revisar/revisar.module.css";
import styles from "@/app/revisar/jogos/jogos.module.css";

const ESPERA_ERRO_MS = 1300;
/** Relógio (fora do componente: só é chamado em toques e no intervalo, nunca ao desenhar). */
const relogio = () => Date.now();

export function Memoria({ cartas }: { cartas: Carta<Sinal>[] }) {
  const router = useRouter();
  const [viradas, setViradas] = useState<string[]>([]);
  const [achados, setAchados] = useState<Set<string>>(() => new Set());
  const [tentativas, setTentativas] = useState(0);
  const [erros, setErros] = useState<Record<string, number>>({});
  const [inicio, setInicio] = useState<number | null>(null);
  const [agora, setAgora] = useState(0);
  const [fimEm, setFimEm] = useState<number | null>(null);
  const [enviado, setEnviado] = useState<"nao" | "enviando" | "ok" | "erro">("nao");
  const espera = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalPares = cartas.length / 2;
  const terminou = achados.size === totalPares;

  useEffect(() => {
    if (inicio === null || terminou) return;
    const t = setInterval(() => setAgora(relogio()), 1000);
    return () => clearInterval(t);
  }, [inicio, terminou]);
  useEffect(() => () => {
    if (espera.current) clearTimeout(espera.current);
  }, []);

  function tocar(c: Carta<Sinal>) {
    if (achados.has(c.item.id) || viradas.includes(c.chave) || viradas.length >= 2) return;
    if (inicio === null) setInicio(relogio());
    if (viradas.length === 0) {
      setViradas([c.chave]);
      return;
    }
    const primeira = cartas.find((x) => x.chave === viradas[0])!;
    setViradas([viradas[0], c.chave]);
    setTentativas((n) => n + 1);
    if (formamPar(primeira, c)) {
      const novos = new Set(achados).add(c.item.id);
      setAchados(novos);
      setViradas([]);
      if (novos.size === totalPares) setFimEm(relogio());
    } else {
      setErros((e) => ({
        ...e,
        [primeira.item.id]: (e[primeira.item.id] ?? 0) + 1,
        [c.item.id]: (e[c.item.id] ?? 0) + 1,
      }));
      espera.current = setTimeout(() => setViradas([]), ESPERA_ERRO_MS);
    }
  }

  const segundos = inicio === null ? 0 : ((fimEm ?? Math.max(agora, inicio)) - inicio) / 1000;

  if (terminou) {
    const dificeis = paresDificeis(erros);
    const nomes = dificeis.map((id) => cartas.find((c) => c.item.id === id)!.item.word);
    async function mandar() {
      setEnviado("enviando");
      const r = await Promise.all(dificeis.map((id) => responderCartao(id, "errei").catch(() => ({ ok: false }))));
      setEnviado(r.every((x) => x.ok) ? "ok" : "erro");
    }
    return (
      <div className={base.vazio}>
        <h2>Achou os {totalPares} pares!</h2>
        <p>
          Em {formatarTempo(segundos)}, com {tentativas} tentativas
          {tentativas === totalPares ? " — perfeito, nenhum erro!" : "."}
        </p>
        {dificeis.length > 0 && (
          <div className={styles.dificeis}>
            <p>
              <strong>Os que deram mais trabalho:</strong> {nomes.join(", ")}.
            </p>
            {enviado === "ok" ? (
              <p role="status">Pronto: eles aparecem na revisão de hoje.</p>
            ) : (
              <>
                {enviado === "erro" && <p role="alert">Não deu para salvar. Confira a internet e tente de novo.</p>}
                <button type="button" className={base.botaoSecundario} onClick={mandar} disabled={enviado === "enviando"}>
                  {enviado === "enviando" ? "Mandando…" : "Mandar para a revisão de hoje"}
                </button>
              </>
            )}
          </div>
        )}
        <div className={base.acoes}>
          <button type="button" className={base.botaoPrincipal} onClick={() => router.refresh()}>
            Jogar de novo
          </button>
          <Link href="/revisar/jogos" className={base.botaoSecundario}>
            Outros jogos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className={base.sessao} aria-label="Jogo da memória">
      <div className={styles.placar} aria-live="polite">
        <span>
          Pares: <strong>{achados.size}</strong>/{totalPares}
        </span>
        <span>
          Tentativas: <strong>{tentativas}</strong>
        </span>
        <span>
          ⏱ <strong>{formatarTempo(segundos)}</strong>
        </span>
      </div>
      <ul className={styles.tabuleiro}>
        {cartas.map((c) => {
          const achou = achados.has(c.item.id);
          const aberta = achou || viradas.includes(c.chave);
          const errou = viradas.length === 2 && aberta && !achou;
          return (
            <li key={c.chave}>
              <button
                type="button"
                className={styles.carta}
                data-estado={achou ? "achou" : errou ? "errou" : aberta ? "aberta" : "fechada"}
                aria-label={aberta ? (c.lado === "palavra" ? c.item.word : `Sinal (${achou ? c.item.word : "mídia"})`) : "Carta virada para baixo"}
                onClick={() => tocar(c)}
              >
                {!aberta ? (
                  <span className={styles.verso} aria-hidden="true">
                    ?
                  </span>
                ) : c.lado === "palavra" ? (
                  <span className={styles.palavraCarta}>{c.item.word}</span>
                ) : c.item.media_type === "video" ? (
                  <VideoPausavel src={c.item.media_url!} className={styles.midiaCarta} muted loop autoPlay playsInline aria-hidden />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.item.media_url!} alt="" className={styles.midiaCarta} />
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <p className={base.ajuda}>Vire duas cartas: o sinal (foto ou vídeo) e a palavra dele formam um par.</p>
    </section>
  );
}
