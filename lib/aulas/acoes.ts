"use server";
// Marcar e desmarcar aula concluída: só a dona, só aulas que existem.
import { revalidatePath } from "next/cache";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { getAula } from "./aulas";

export async function marcarAula(slug: string, concluida: boolean): Promise<{ ok: boolean }> {
  if (!getAula(slug)) return { ok: false };
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  const supabase = await createClient();
  const { error } = concluida
    ? await supabase
        .from("lesson_progress")
        .upsert({ user_id: user.id, lesson_slug: slug }, { onConflict: "user_id,lesson_slug", ignoreDuplicates: true })
    : await supabase.from("lesson_progress").delete().eq("user_id", user.id).eq("lesson_slug", slug);
  if (error) {
    console.error("marcarAula:", error.message);
    return { ok: false };
  }
  revalidatePath("/aulas", "layout");
  return { ok: true };
}
