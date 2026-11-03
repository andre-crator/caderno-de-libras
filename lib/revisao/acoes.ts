"use server";
// Grava a resposta de um cartão: novo nível e próxima data (agenda de Leitner).
// Só a dona, só a própria linha (RLS + filtro). O nível vem do banco, não do navegador.
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { type Resposta, proximaRevisao } from "./agenda";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const RESPOSTAS: readonly Resposta[] = ["errei", "duvida", "acertei"];

export async function responderCartao(id: string, resposta: Resposta): Promise<{ ok: boolean; nivel?: number }> {
  if (!UUID.test(id) || !RESPOSTAS.includes(resposta)) return { ok: false };
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  const supabase = await createClient();
  const { data: atual } = await supabase
    .from("signs")
    .select("review_level")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!atual) return { ok: false };

  const agora = new Date();
  const { nivel, proximaEm } = proximaRevisao(Number(atual.review_level), resposta, agora);
  const { data, error } = await supabase
    .from("signs")
    .update({ review_level: nivel, review_due_at: proximaEm.toISOString(), reviewed_at: agora.toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id");
  if (error || data?.length !== 1) {
    if (error) console.error("responderCartao:", error.message);
    return { ok: false };
  }
  return { ok: true, nivel };
}
