// Aulas concluídas pela usuária logada (servidor). Nunca em cache compartilhado.
import "server-only";
import { createClient, getCurrentUser } from "@/lib/supabase/server";

export type Progresso = { feitas: Set<string>; erro: boolean };

/**
 * Aulas concluídas; null = ninguém logado. Se o banco falhar (ex.: tabela ainda
 * não criada), as aulas abrem mesmo assim e `erro` avisa a página.
 */
export async function aulasConcluidas(): Promise<Progresso | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("lesson_progress").select("lesson_slug").eq("user_id", user.id);
  if (error) {
    console.error("aulasConcluidas:", error.message);
    return { feitas: new Set(), erro: true };
  }
  return { feitas: new Set((data ?? []).map((d) => d.lesson_slug as string)), erro: false };
}
