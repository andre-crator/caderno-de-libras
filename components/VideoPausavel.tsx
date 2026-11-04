"use client";
// <video> que pausa sozinho quando a tela é escondida. No Next 16 a página anterior
// fica escondida (Activity) em vez de desmontada: sem isto, o vídeo seguiria tocando.
import { useLayoutEffect, useRef, type VideoHTMLAttributes } from "react";

export function VideoPausavel(props: VideoHTMLAttributes<HTMLVideoElement>) {
  const ref = useRef<HTMLVideoElement>(null);
  useLayoutEffect(() => {
    const video = ref.current;
    return () => video?.pause();
  }, []);
  return <video ref={ref} {...props} />;
}
