"use client";
// Vídeo do YouTube pelo player oficial (youtube-nocookie). Até o toque, só a
// miniatura: o player não carrega nada nem gasta dados à toa. Nada é desenhado
// na frente do player e nenhuma função dele é bloqueada (regras do YouTube).
import { useState } from "react";
import { miniatura, urlDoPlayer, urlNoYoutube, type VideoAula } from "@/lib/aulas/aulas";
import styles from "@/app/aulas/aulas.module.css";

export function PlayerYoutube({ video }: { video: VideoAula }) {
  const [tocando, setTocando] = useState(false);
  return (
    <figure className={styles.video}>
      <div className={styles.moldura}>
        {tocando ? (
          <iframe
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
