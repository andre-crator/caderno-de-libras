import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { getSinal } from "@/lib/sinais/dados";
import { FormSinal } from "@/components/caderno/FormSinal";
import styles from "../../caderno.module.css";

export const metadata: Metadata = { title: "Editar sinal" };

export default function EditarSinalPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main className={styles.page}>
      <Suspense fallback={<div className={styles.esqueleto} aria-busy="true" />}>
        <Conteudo params={params} />
      </Suspense>
    </main>
  );
}

async function Conteudo({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/caderno/${encodeURIComponent(id)}/editar`);
  const s = await getSinal(id);
  if (!s) notFound();
  return (
    <>
      <Link href={`/caderno/${s.id}`} className={styles.voltar}>
        ← {s.word}
      </Link>
      <h1 className={styles.titulo}>Editar sinal</h1>
      <FormSinal
        userId={user.id}
        inicial={{
          id: s.id,
          kind: s.kind,
          word: s.word,
          category: s.category ?? "",
          lesson: s.lesson ?? "",
          hand_shape: s.hand_shape ?? "",
          location: s.location ?? "",
          movement: s.movement ?? "",
          palm_orientation: s.palm_orientation ?? "",
          non_manual: s.non_manual ?? "",
          tip: s.tip ?? "",
          media_path: s.media_path,
          media_type: s.media_type,
          media_url: s.media_url,
        }}
      />
    </>
  );
}
