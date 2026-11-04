// Dias estudados e meta da usuária logada (servidor). Dados dela: nunca em cache.
import "server-only";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { diaEmBrasilia, META_PADRAO } from "./semana";

const DIAS_DE_HISTORICO = 400;

export async function lerMeta(): Promise<{ dias: string[]; meta: number; erro: boolean } | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  const desde = diaEmBrasilia(new Date(Date.now() - DIAS_DE_HISTORICO * 24 * 60 * 60 * 1000));
  const [dias, perfil] = await Promise.all([
    supabase.from("study_days").select("day").eq("user_id", user.id).gte("day", desde).limit(1000),
    supabase.from("profiles").select("weekly_goal").eq("id", user.id).maybeSingle(),
  ]);
  if (dias.error) console.error("lerMeta dias:", dias.error.message);
  if (perfil.error) console.error("lerMeta perfil:", perfil.error.message);
  return {
    dias: (dias.data ?? []).map((d) => String(d.day)),
    meta: Number(perfil.data?.weekly_goal ?? META_PADRAO),
    erro: Boolean(dias.error || perfil.error),
  };
}
