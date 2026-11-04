import styles from "@/app/caderno/caderno.module.css";
import { VideoPausavel } from "@/components/VideoPausavel";

// Mostra a foto ou o vídeo privado do sinal (URL assinada, vale 1 hora).
export function MidiaSinal({
  url,
  tipo,
  palavra,
  pequena = false,
}: {
  url: string | null;
  tipo: "foto" | "video" | null;
  palavra: string;
  pequena?: boolean;
}) {
  const classe = pequena ? styles.miniatura : styles.midiaGrande;
  if (!url || !tipo) {
    return (
      <div className={`${classe} ${styles.semMidia}`} aria-hidden={pequena}>
        {pequena ? palavra.slice(0, 1).toUpperCase() : "Sem foto ou vídeo"}
      </div>
    );
  }
  if (tipo === "foto") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={pequena ? "" : `Sinal de ${palavra}`} className={classe} loading="lazy" />;
  }
  return pequena ? (
    <video src={`${url}#t=0.1`} className={classe} muted playsInline preload="metadata" aria-hidden />
  ) : (
    <VideoPausavel src={url} className={classe} controls playsInline loop preload="metadata" aria-label={`Sinal de ${palavra}`} />
  );
}
