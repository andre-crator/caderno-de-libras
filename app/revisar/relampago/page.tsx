import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { listarSinais } from "@/lib/sinais/dados";
import { VIDEOS_MINIMOS, podeJogarRelampago } from "@/lib/jogos/relampago";
import { Relampago } from "@/components/jogos/Relampago";
import base from "../revisar.module.css";

export const metadata: Metadata = { title: "Sinal relâmpago" };

export default function RelampagoPage() {
  return (
    <main className={base.page}>
      <Link href="/revisar/jogos" className={base.voltar}>
        ← Jogos
      </Link>
      <h1 className={base.titulo}>Sinal relâmpago</h1>
      <Suspense fallback={<div className={base.esqueleto} aria-busy="true" />}>
        <Conteudo />
      </Suspense>
    </main>
  );
}

async function Conteudo() {
  const sinais = await listarSinais();
  if (!sinais) redirect("/login?next=/revisar/relampago");
  const videos = sinais.filter((s) => s.media_type === "video" && s.media_url);
  if (!podeJogarRelampago(videos, sinais)) {
    return (
      <div className={base.vazio}>
        <h2>Quase lá!</h2>
        <p>
          O relâmpago usa os vídeos do seu caderno. Precisa de pelo menos {VIDEOS_MINIMOS} sinais com vídeo, de palavras
          diferentes (você tem {videos.length}).
        </p>
        <div className={base.acoes}>
          <Link href="/caderno/novo" className={base.botaoPrincipal}>
            Gravar sinal
          </Link>
        </div>
      </div>
    );
  }
  return <Relampago videos={videos} todos={sinais} />;
}
