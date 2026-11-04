// Marca "hoje ela estudou" (dia de Brasília, o banco preenche). Repetir no mesmo dia
// não faz nada. Falha aqui nunca atrapalha o estudo: só registra no log.
import "server-only";
import type { createClient } from "@/lib/supabase/server";

export async function registrarDia(supabase: Awaited<ReturnType<typeof createClient>>, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from("study_days")
    .upsert({ user_id: userId }, { onConflict: "user_id,day", ignoreDuplicates: true });
  if (error) console.error("registrarDia:", error.message);
  return !error;
}
