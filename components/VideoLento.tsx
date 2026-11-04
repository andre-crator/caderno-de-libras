"use client";
// Vídeo de sinal com câmera lenta e "repetir": ajuda a entender quem sinaliza rápido.
// Pausa sozinho quando a tela é escondida (Next 16 / Activity, ver VideoPausavel).
import { useLayoutEffect, useRef, useState } from "react";
import styles from "./VideoLento.module.css";

const VELOCIDADES = [0.5, 0.75, 1] as const;

export function VideoLento({ src, rotulo, className }: { src: string; rotulo: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [velocidade, setVelocidade] = useState<number>(1);

  useLayoutEffect(() => {
    const video = ref.current;
    return () => video?.pause();
  }, []);

  function mudar(v: number) {
    setVelocidade(v);
    if (ref.current) ref.current.playbackRate = v;
  }

  function repetir() {
    const v = ref.current;
    if (!v) return;
    v.currentTime = 0;
    v.playbackRate = velocidade;
    void v.play().catch(() => {});
  }

  return (
    <div className={styles.caixa}>
      <video
        ref={ref}
        src={src}
        className={className}
        controls
        playsInline
        loop
        preload="metadata"
        aria-label={rotulo}
        onLoadedMetadata={(e) => (e.currentTarget.playbackRate = velocidade)}
      />
      <div className={styles.controles} role="group" aria-label="Velocidade do vídeo">
        {VELOCIDADES.map((v) => (
          <button key={v} type="button" aria-pressed={velocidade === v} onClick={() => mudar(v)}>
            {v === 1 ? "Normal" : `${String(v).replace(".", ",")}×`}
          </button>
        ))}
        <button type="button" onClick={repetir} className={styles.repetir}>
          ↺ Repetir
        </button>
      </div>
    </div>
  );
}
