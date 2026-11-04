// Números da tela inicial (servidor). Uma ida ao banco por número, em paralelo.
import "server-only";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { aulasConcluidas } from "@/lib/aulas/progresso";

export type Resumo = {
  nome: string | null;
  sinais: number;
  vencidos: number;
  revisados: number;
  feitas: Set<string>;
  erro: boolean;
};

export async function resumoDoPainel(): Promise<Resumo | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  const agora = new Date().toISOString();
  const contar = () => supabase.from("signs").select("id", { count: "exact", head: true }).eq("user_id", user.id);

  const [perfil, sinais, vencidos, revisados, progresso] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
    contar(),
    contar().lte("review_due_at", agora),
    contar().not("reviewed_at", "is", null),
    aulasConcluidas(),
  ]);

  const erro = Boolean(sinais.error || vencidos.error || revisados.error || progresso?.erro);
  if (erro) console.error("resumoDoPainel:", sinais.error?.message ?? vencidos.error?.message ?? revisados.error?.message);
  return {
    nome: (perfil.data?.full_name as string | null | undefined) ?? null,
    sinais: sinais.count ?? 0,
    vencidos: vencidos.count ?? 0,
    revisados: revisados.count ?? 0,
    feitas: progresso?.feitas ?? new Set(),
    erro,
  };
}
