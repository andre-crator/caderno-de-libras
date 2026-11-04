"use client";
// Vídeo do YouTube pelo player oficial (youtube-nocookie). Até o toque, só a
// miniatura: o player não carrega nada nem gasta dados à toa. Nada é desenhado
// na frente do player e nenhuma função dele é bloqueada (regras do YouTube).
import { useLayoutEffect, useRef, useState } from "react";
import { miniatura, urlDoPlayer, urlNoYoutube, type VideoAula } from "@/lib/aulas/aulas";
import styles from "@/app/aulas/aulas.module.css";

export function PlayerYoutube({ video }: { video: VideoAula }) {
  const [tocando, setTocando] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // O Next 16 não desmonta a página ao sair: esconde (Activity). Sem isto, o vídeo
  // continuaria tocando escondido. Ao esconder, para o player e volta à miniatura.
  // Roda só ao montar/esconder (deps vazias): a limpeza não pode rodar ao dar play.
  useLayoutEffect(() => {
    const ref = iframeRef;
    return () => {
      // Lê o iframe na hora de esconder (ele pode ter aparecido depois de montar).
      if (ref.current) ref.current.src = "about:blank";
      setTocando(false);
    };
  }, []);
  return (
    <figure className={styles.video}>
      <div className={styles.moldura}>
        {tocando ? (
          <iframe
            ref={iframeRef}
            src={urlDoPlayer(video.id)}
            title={video.titulo}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button type="button" className={styles.capa} onClick={() => setTocando(true)} aria-label={`Assistir: ${video.titulo}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={miniatura(video.id)} alt="" loading="lazy" />
            <span className={styles.play} aria-hidden="true">▶</span>
          </button>
        )}
      </div>
      <figcaption className={styles.legenda}>
        <strong>{video.titulo}</strong>
        <span>
          {video.canal ? `Canal: ${video.canal} · ` : ""}
          <a href={urlNoYoutube(video.id)} target="_blank" rel="noopener noreferrer">
            abrir no YouTube
          </a>
          {!video.conferido && <em className={styles.naoConferido}>ainda não conferido</em>}
        </span>
      </figcaption>
    </figure>
  );
}
