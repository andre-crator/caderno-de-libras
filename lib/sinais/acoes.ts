"use server";
// Criar, editar e apagar sinais: só a usuária logada, só nas próprias linhas
// (RLS + filtro por user_id). A mídia já foi enviada pelo navegador para a pasta
// dela no bucket; aqui só gravamos o caminho, depois de conferir que é da pasta dela.
import { revalidatePath } from "next/cache";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { BUCKET_MIDIA, type EntradaSinal, midiaNaPastaDe, validarSinal } from "./formato";

export type Resultado = { ok: true; id: string } | { ok: false; erros: string[] };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Cliente = Awaited<ReturnType<typeof createClient>>;

/** Apaga o arquivo do bucket só se nenhum sinal dela ainda usa esse caminho. */
async function removerSeSemUso(supabase: Cliente, userId: string, caminho: string): Promise<void> {
  if (!midiaNaPastaDe(userId, caminho)) return;
  const { count, error: erroContagem } = await supabase
    .from("signs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("media_path", caminho);
  if (erroContagem) {
    console.error("removerSeSemUso (contagem):", erroContagem.message);
    return; // na dúvida, não apaga
  }
  if (count) return;
  const { error } = await supabase.storage.from(BUCKET_MIDIA).remove([caminho]);
  if (error) console.error("removerSeSemUso (storage):", error.message);
}

const NAO_LOGADA: Resultado = { ok: false, erros: ["Sua sessão terminou. Entre de novo."] };
const FALHA: Resultado = { ok: false, erros: ["Não deu para salvar agora. Confira a internet e tente de novo."] };

export async function criarSinal(entrada: EntradaSinal): Promise<Resultado> {
  const user = await getCurrentUser();
  if (!user) return NAO_LOGADA;
  const v = validarSinal(entrada, user.id);
  if (!v.ok) return v;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("signs")
    .insert({ ...v.dados, user_id: user.id })
    .select("id")
    .single();
  if (error || !data) {
    console.error("criarSinal:", error?.message);
    return FALHA;
  }
  revalidatePath("/caderno", "layout");
  return { ok: true, id: data.id as string };
}

export async function atualizarSinal(id: string, entrada: EntradaSinal): Promise<Resultado> {
  if (!UUID.test(id)) return { ok: false, erros: ["Esse sinal não existe mais."] };
  const user = await getCurrentUser();
  if (!user) return NAO_LOGADA;
  const v = validarSinal(entrada, user.id);
  if (!v.ok) return v;
  const supabase = await createClient();

  const { data: antes } = await supabase.from("signs").select("media_path").eq("id", id).eq("user_id", user.id).maybeSingle();
  if (!antes) return { ok: false, erros: ["Esse sinal não existe mais."] };

  const { error } = await supabase.from("signs").update(v.dados).eq("id", id).eq("user_id", user.id);
  if (error) {
    console.error("atualizarSinal:", error.message);
    return FALHA;
  }
  // Trocou ou tirou a mídia: apaga o arquivo antigo para não ocupar espaço.
  if (antes.media_path && antes.media_path !== v.dados.media_path) {
    await removerSeSemUso(supabase, user.id, antes.media_path as string);
  }
  revalidatePath("/caderno", "layout");
  return { ok: true, id };
}

export async function apagarSinal(id: string): Promise<{ ok: boolean }> {
  if (!UUID.test(id)) return { ok: false };
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("signs")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("media_path")
    .maybeSingle();
  if (error) {
    console.error("apagarSinal:", error.message);
    return { ok: false };
  }
  if (data?.media_path) await removerSeSemUso(supabase, user.id, data.media_path as string);
  revalidatePath("/caderno", "layout");
  return { ok: true };
}

/** Apaga um arquivo enviado que acabou não sendo usado (ex.: ela desistiu no formulário). */
export async function descartarMidia(caminho: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user || typeof caminho !== "string") return;
  const supabase = await createClient();
  await removerSeSemUso(supabase, user.id, caminho);
}
