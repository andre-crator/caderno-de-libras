"use client";
// Sinal relâmpago: vídeo do caderno + 3 palavras. Começa em 0,5× e acelera a cada
// 5 acertos. 3 vidas. Erros não mexem na revisão sozinhos: no fim ela escolhe.
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { responderCartao } from "@/lib/revisao/acoes";
import {
  ACERTOS_POR_NIVEL,
  VIDAS,
  lerRecorde,
  pontosDoAcerto,
  proximaPergunta,
  rotuloVelocidade,
  salvarRecorde,
  velocidadeDe,
} from "@/lib/jogos/relampago";
import type { Sinal } from "@/lib/sinais/dados";
import { VideoPausavel } from "@/components/VideoPausavel";
import base from "@/app/revisar/revisar.module.css";
import styles from "@/app/revisar/jogos/jogos.module.css";

const ESPERA_ACERTO_MS = 700;
const ESPERA_ERRO_MS = 1600;

type Pergunta = { item: Sinal; opcoes: string[] };
type Fase = "inicio" | "jogando" | "fim";

const semAssinatura = () => () => {};

export function Relampago({ videos, todos }: { videos: Sinal[]; todos: Sinal[] }) {
  const recordeSalvo = useSyncExternalStore(semAssinatura, lerRecorde, () => 0);
  const [fase, setFase] = useState<Fase>("inicio");
  const [pergunta, setPergunta] = useState<Pergunta | null>(null);
  const [escolha, setEscolha] = useState<string | null>(null);
  const [vidas, setVidas] = useState(VIDAS);
  const [acertos, setAcertos] = useState(0);
  const [combo, setCombo] = useState(0);
  const [pontos, setPontos] = useState(0);
  const [recordeAntes, setRecordeAntes] = useState(0);
  const [errados, setErrados] = useState<Sinal[]>([]);
  const [enviado, setEnviado] = useState<"nao" | "enviando" | "ok">("nao");
  const espera = useRef<ReturnType<typeof setTimeout> | null>(null);
  const video = useRef<HTMLVideoElement>(null);

  const velocidade = velocidadeDe(acertos);

  useEffect(() => () => {
    if (espera.current) clearTimeout(espera.current);
  }, []);
  useEffect(() => {
    if (video.current) video.current.playbackRate = velocidade;
  }, [velocidade, pergunta]);

  function comecar() {
    setRecordeAntes(lerRecorde());
    setVidas(VIDAS);
    setAcertos(0);
    setCombo(0);
    setPontos(0);
    setErrados([]);
    setEnviado("nao");
    setEscolha(null);
    setPergunta(proximaPergunta(videos, todos, null));
    setFase("jogando");
  }

  function escolher(palavra: string) {
    if (!pergunta || escolha !== null) return;
    setEscolha(palavra);
    const certo = palavra === pergunta.item.word;
    let vidasDepois = vidas;
    if (certo) {
      setAcertos((n) => n + 1);
      setCombo((n) => n + 1);
      setPontos((p) => p + pontosDoAcerto(velocidade, combo + 1));
    } else {
      vidasDepois = vidas - 1;
      setVidas(vidasDepois);
      setCombo(0);
      if (!errados.some((e) => e.id === pergunta.item.id)) setErrados((l) => [...l, pergunta.item]);
    }
    espera.current = setTimeout(
      () => {
        if (vidasDepois <= 0) {
          setFase("fim");
          setPontos((p) => {
            if (p > lerRecorde()) salvarRecorde(p);
            return p;
          });
          return;
        }
        setEscolha(null);
        setPergunta(proximaPergunta(videos, todos, pergunta.item.id));
      },
      certo ? ESPERA_ACERTO_MS : ESPERA_ERRO_MS,
    );
  }

  if (fase === "inicio") {
    return (
      <div className={base.vazio}>
        <h2>Pronta?</h2>
        <p>
          Os vídeos começam em câmera lenta e ficam mais rápidos a cada {ACERTOS_POR_NIVEL} acertos. Você tem {VIDAS}{" "}
          vidas.
        </p>
        {recordeSalvo > 0 && (
          <p>
            Seu recorde: <strong>{recordeSalvo} pontos</strong>
          </p>
        )}
        <div className={base.acoes}>
          <button type="button" className={base.botaoPrincipal} onClick={comecar}>
            Começar
          </button>
        </div>
      </div>
    );
  }

  if (fase === "fim" || !pergunta) {
    const bateu = pontos > recordeAntes && pontos > 0;
    async function mandar() {
      setEnviado("enviando");
      await Promise.all(errados.map((s) => responderCartao(s.id, "errei").catch(() => null)));
      setEnviado("ok");
    }
    return (
      <div className={base.vazio}>
        <h2>{bateu ? "Novo recorde!" : "Fim de jogo"}</h2>
        <p>
          <strong>{pontos} pontos</strong> · {acertos} {acertos === 1 ? "acerto" : "acertos"} · chegou a{" "}
          {rotuloVelocidade(velocidade)}
        </p>
        {!bateu && recordeAntes > 0 && <p>Recorde: {recordeAntes} pontos.</p>}
        {errados.length > 0 && (
          <div className={styles.dificeis}>
            <p>
              <strong>Errou:</strong> {errados.map((s) => s.word).join(", ")}.
            </p>
            {enviado === "ok" ? (
              <p role="status">Pronto: eles aparecem na revisão de hoje.</p>
            ) : (
              <button type="button" className={base.botaoSecundario} onClick={mandar} disabled={enviado === "enviando"}>
                {enviado === "enviando" ? "Mandando…" : "Mandar para a revisão de hoje"}
              </button>
            )}
          </div>
        )}
        <div className={base.acoes}>
          <button type="button" className={base.botaoPrincipal} onClick={comecar}>
            Jogar de novo
          </button>
          <a href="/revisar/jogos" className={base.botaoSecundario}>
            Outros jogos
          </a>
        </div>
      </div>
    );
  }

  const respondeu = escolha !== null;
  const proximoNivel = ACERTOS_POR_NIVEL - (acertos % ACERTOS_POR_NIVEL);

  return (
    <section className={base.sessao} aria-label="Sinal relâmpago">
      <div className={styles.placar} aria-live="polite">
        <span aria-label={`${vidas} de ${VIDAS} vidas`}>
          {"♥".repeat(vidas)}
          <span className={styles.vidaPerdida}>{"♥".repeat(VIDAS - vidas)}</span>
        </span>
        <span>
          <strong>{pontos}</strong> pts{combo >= 2 && <span className={styles.combo}> combo ×{combo}</span>}
        </span>
        <span className={styles.velocidade}>{rotuloVelocidade(velocidade)}</span>
      </div>
      <div className={base.cartao}>
        <p className={base.eyebrow}>Que sinal é este?</p>
        <VideoPausavel
          key={`${pergunta.item.id}-${acertos}-${vidas}`}
          ref={video}
          src={pergunta.item.media_url!}
          className={styles.videoRelampago}
          muted
          loop
          autoPlay
          playsInline
          aria-label="Vídeo do sinal"
          onLoadedMetadata={(e) => (e.currentTarget.playbackRate = velocidade)}
        />
        <p className={base.ajuda}>
          {velocidade < 1.5 ? `Mais ${proximoNivel} ${proximoNivel === 1 ? "acerto" : "acertos"} e acelera.` : "Velocidade máxima!"}
        </p>
      </div>
      <div className={styles.opcoes3} role="group" aria-label="Escolha a palavra">
        {pergunta.opcoes.map((o) => {
          const estado = !respondeu ? undefined : o === pergunta.item.word ? "certa" : o === escolha ? "errada" : "neutra";
          return (
            <button key={o} type="button" data-estado={estado} onClick={() => escolher(o)} disabled={respondeu}>
              {o}
            </button>
          );
        })}
      </div>
      {respondeu && escolha !== pergunta.item.word && (
        <p className={base.feedback} role="status">
          Era “{pergunta.item.word}”.
        </p>
      )}
    </section>
  );
}
