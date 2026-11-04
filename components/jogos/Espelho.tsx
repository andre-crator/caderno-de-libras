"use client";
// Desafio do espelho: ela vê a PALAVRA, faz o sinal e se grava com a câmera da frente;
// depois compara lado a lado com o vídeo/foto do caderno e diz como foi.
// O vídeo dela fica só nesta tela (URL local): não é salvo nem enviado.
import { useEffect, useState } from "react";
import { responderCartao } from "@/lib/revisao/acoes";
import type { Resposta } from "@/lib/revisao/agenda";
import type { Sinal } from "@/lib/sinais/dados";
import { VideoPausavel } from "@/components/VideoPausavel";
import base from "@/app/revisar/revisar.module.css";
import styles from "@/app/revisar/jogos/jogos.module.css";

type Fase = "inicio" | "fazer" | "comparar" | "feito";

function sortear(sinais: Sinal[], anterior: string | null): Sinal {
  const opcoes = sinais.length > 1 ? sinais.filter((s) => s.id !== anterior) : sinais;
  return opcoes[Math.floor(Math.random() * opcoes.length)];
}

export function Espelho({ sinais }: { sinais: Sinal[] }) {
  const [fase, setFase] = useState<Fase>("inicio");
  const [sinal, setSinal] = useState<Sinal | null>(null);
  const [gravacao, setGravacao] = useState<string | null>(null);
  const [dupla, setDupla] = useState(false);
  const [feitos, setFeitos] = useState(0);
  const [salvando, setSalvando] = useState(false);

  // Solta o vídeo local da memória ao trocar ou sair.
  useEffect(() => () => {
    if (gravacao) URL.revokeObjectURL(gravacao);
  }, [gravacao]);

  function proximo() {
    setGravacao(null);
    setSinal(sortear(sinais, sinal?.id ?? null));
    setFase("fazer");
  }

  async function responder(r: Resposta) {
    if (!sinal) return;
    setSalvando(true);
    await responderCartao(sinal.id, r).catch(() => null);
    setSalvando(false);
    setFeitos((n) => n + 1);
    setFase("feito");
  }

  if (fase === "inicio" || !sinal) {
    return (
      <div className={base.vazio}>
        <h2>Como funciona</h2>
        <p>
          Aparece uma palavra do seu caderno. Faça o sinal e grave com a câmera da frente. Depois compare com o que
          você guardou da aula.
        </p>
        <label className={styles.escolha}>
          <input type="checkbox" checked={dupla} onChange={(e) => setDupla(e.target.checked)} />
          Alguém vai conferir comigo
        </label>
        {dupla && (
          <p className={styles.dicaDupla}>
            Quem confere não precisa saber Libras: é só olhar os dois vídeos e dizer se a mão, o lugar e o movimento
            estão parecidos.
          </p>
        )}
        <div className={base.acoes}>
          <button type="button" className={base.botaoPrincipal} onClick={proximo}>
            Começar
          </button>
        </div>
      </div>
    );
  }

  if (fase === "fazer") {
    return (
      <section className={base.sessao} aria-label="Desafio do espelho">
        <div className={base.cartao}>
          <p className={base.eyebrow}>Faça o sinal de</p>
          <p className={base.palavra}>{sinal.word}</p>
          {sinal.category && <p className={base.ajuda}>{sinal.category}</p>}
        </div>
        <label className={`${base.botaoPrincipal} ${base.largo} ${styles.botaoArquivo}`}>
          🎥 Gravar com a câmera da frente
          <input
            type="file"
            accept="video/*"
            capture="user"
            className={styles.arquivoEscondido}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setGravacao(URL.createObjectURL(f));
              setFase("comparar");
              e.target.value = "";
            }}
          />
        </label>
        <button type="button" className={`${base.botaoSecundario} ${base.largo}`} onClick={() => setFase("comparar")}>
          Fiz no espelho, sem gravar
        </button>
        <p className={base.ajuda}>Seu vídeo fica só nesta tela: não é salvo nem enviado.</p>
      </section>
    );
  }

  if (fase === "comparar") {
    return (
      <section className={base.sessao} aria-label="Comparar">
        <p className={base.eyebrow}>{sinal.word}</p>
        <div className={gravacao ? styles.ladoALado : undefined}>
          {gravacao && (
            <figure className={styles.quadro}>
              <VideoPausavel src={gravacao} className={styles.videoComparar} controls loop autoPlay muted playsInline />
              <figcaption>Você</figcaption>
            </figure>
          )}
          <figure className={styles.quadro}>
            {sinal.media_type === "video" ? (
              <VideoPausavel src={sinal.media_url!} className={styles.videoComparar} controls loop autoPlay muted playsInline />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={sinal.media_url!} alt={`Sinal de ${sinal.word}`} className={styles.videoComparar} />
            )}
            <figcaption>Do caderno</figcaption>
          </figure>
        </div>
        <p className={styles.dicaDupla}>
          {dupla ? "Para quem confere: " : "Compare: "}formato da mão, lugar, movimento, palma e expressão do rosto.
        </p>
        <div className={base.notas} role="group" aria-label="Como foi?">
          <button type="button" className={base.errei} disabled={salvando} onClick={() => responder("errei")}>
            Errei
          </button>
          <button type="button" className={base.duvida} disabled={salvando} onClick={() => responder("duvida")}>
            Quase
          </button>
          <button type="button" className={base.acertei} disabled={salvando} onClick={() => responder("acertei")}>
            Igual!
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className={base.vazio}>
      <h2>{feitos === 1 ? "1 desafio feito" : `${feitos} desafios feitos`}</h2>
      <p>A revisão já foi ajustada com a sua resposta.</p>
      <div className={base.acoes}>
        <button type="button" className={base.botaoPrincipal} onClick={proximo}>
          Próximo sinal
        </button>
        <a href="/revisar/jogos" className={base.botaoSecundario}>
          Outros jogos
        </a>
      </div>
    </div>
  );
}
