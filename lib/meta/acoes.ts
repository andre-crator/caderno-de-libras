"use server";
// Meta da semana, dia estudado e inscrição do lembrete. Só a dona (RLS + filtro).
import { revalidatePath } from "next/cache";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { registrarDia } from "./registrar";
import { endpointPermitido } from "./push";
import { METAS } from "./semana";

/** Para telas que não gravam nada (jogos, soletrar): conta o dia como estudado. */
export async function registrarEstudo(): Promise<{ ok: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  const ok = await registrarDia(await createClient(), user.id);
  return { ok };
}

export async function definirMeta(meta: number): Promise<{ ok: boolean }> {
  if (!(METAS as readonly number[]).includes(meta)) return { ok: false };
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").update({ weekly_goal: meta }).eq("id", user.id).select("id");
  if (error || data?.length !== 1) {
    if (error) console.error("definirMeta:", error.message);
    return { ok: false };
  }
  revalidatePath("/painel");
  return { ok: true };
}

export type Inscricao = { endpoint: string; keys: { p256dh: string; auth: string } };

function inscricaoValida(i: unknown): i is Inscricao {
  if (!i || typeof i !== "object") return false;
  const x = i as Inscricao;
  return (
    endpointPermitido(x.endpoint) &&
    typeof x.keys?.p256dh === "string" &&
    x.keys.p256dh.length <= 200 &&
    typeof x.keys?.auth === "string" &&
    x.keys.auth.length <= 100
  );
}

export async function salvarInscricao(inscricao: Inscricao): Promise<{ ok: boolean }> {
  if (!inscricaoValida(inscricao)) return { ok: false };
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  const supabase = await createClient();
  // O mesmo celular pode ter sido de outra conta: tira de lá antes (função do banco).
  const assumir = await supabase.rpc("assumir_inscricao", { alvo: inscricao.endpoint });
  if (assumir.error) console.error("assumir_inscricao:", assumir.error.message);
  const { error } = await supabase.from("push_subscriptions").upsert(
    { user_id: user.id, endpoint: inscricao.endpoint, p256dh: inscricao.keys.p256dh, auth: inscricao.keys.auth },
    { onConflict: "user_id,endpoint" },
  );
  if (error) console.error("salvarInscricao:", error.message);
  return { ok: !error };
}

export async function apagarInscricao(endpoint: string): Promise<{ ok: boolean }> {
  if (typeof endpoint !== "string" || endpoint.length > 1000) return { ok: false };
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  const supabase = await createClient();
  const { error } = await supabase.from("push_subscriptions").delete().eq("user_id", user.id).eq("endpoint", endpoint);
  if (error) console.error("apagarInscricao:", error.message);
  return { ok: !error };
}
