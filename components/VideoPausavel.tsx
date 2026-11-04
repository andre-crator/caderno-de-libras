"use client";
// <video> que pausa sozinho quando a tela é escondida. No Next 16 a página anterior
// fica escondida (Activity) em vez de desmontada: sem isto, o vídeo seguiria tocando.
import { useLayoutEffect, useRef, type Ref, type VideoHTMLAttributes } from "react";

type Props = VideoHTMLAttributes<HTMLVideoElement> & { ref?: Ref<HTMLVideoElement> };

export function VideoPausavel({ ref: externo, ...props }: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);
  useLayoutEffect(() => {
    const video = ref.current;
    return () => video?.pause();
  }, []);
  return (
    <video
      ref={(el) => {
        ref.current = el;
        if (typeof externo === "function") externo(el);
        else if (externo) externo.current = el;
      }}
      {...props}
    />
  );
}
