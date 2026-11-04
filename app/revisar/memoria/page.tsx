import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { listarSinais } from "@/lib/sinais/dados";
import { PARES_MINIMOS, montarMemoria } from "@/lib/jogos/memoria";
import { Memoria } from "@/components/jogos/Memoria";
import base from "../revisar.module.css";

export const metadata: Metadata = { title: "Jogo da memória" };

export default function MemoriaPage() {
  return (
    <main className={base.page}>
      <Link href="/revisar/jogos" className={base.voltar}>
        ← Jogos
      </Link>
      <h1 className={base.titulo}>Jogo da memória</h1>
      <Suspense fallback={<div className={base.esqueleto} aria-busy="true" />}>
        <Conteudo />
      </Suspense>
    </main>
  );
}

async function Conteudo() {
  const sinais = await listarSinais();
  if (!sinais) redirect("/login?next=/revisar/memoria");
  const cartas = montarMemoria(sinais);
  if (cartas.length === 0) {
    return (
      <div className={base.vazio}>
        <h2>Quase lá!</h2>
        <p>O jogo precisa de pelo menos {PARES_MINIMOS} sinais com foto ou vídeo, de palavras diferentes.</p>
        <div className={base.acoes}>
          <Link href="/caderno/novo" className={base.botaoPrincipal}>
            Guardar sinal
          </Link>
        </div>
      </div>
    );
  }
  return <Memoria key={cartas.map((c) => c.chave).join(",")} cartas={cartas} />;
}
