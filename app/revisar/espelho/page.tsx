import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { listarSinais } from "@/lib/sinais/dados";
import { Espelho } from "@/components/jogos/Espelho";
import base from "../revisar.module.css";

export const metadata: Metadata = { title: "Desafio do espelho" };

export default function EspelhoPage() {
  return (
    <main className={base.page}>
      <Link href="/revisar/jogos" className={base.voltar}>
        ← Jogos
      </Link>
      <h1 className={base.titulo}>Desafio do espelho</h1>
      <Suspense fallback={<div className={base.esqueleto} aria-busy="true" />}>
        <Conteudo />
      </Suspense>
    </main>
  );
}

async function Conteudo() {
  const sinais = await listarSinais();
  if (!sinais) redirect("/login?next=/revisar/espelho");
  const comMidia = sinais.filter((s) => s.media_url && s.media_type);
  if (comMidia.length === 0) {
    return (
      <div className={base.vazio}>
        <h2>Quase lá!</h2>
        <p>Para comparar, o desafio precisa de pelo menos 1 sinal com foto ou vídeo no caderno.</p>
        <div className={base.acoes}>
          <Link href="/caderno/novo" className={base.botaoPrincipal}>
            Guardar sinal
          </Link>
        </div>
      </div>
    );
  }
  return <Espelho sinais={comMidia} />;
}
