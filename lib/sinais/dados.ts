// Sinais da usuária logada (servidor). Nunca em cache compartilhado: são dados dela.
import "server-only";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { BUCKET_MIDIA, type TipoMidia, type TipoSinal } from "./formato";

export type Sinal = {
  id: string;
  kind: TipoSinal;
  word: string;
  category: string | null;
  lesson: string | null;
  hand_shape: string | null;
  location: string | null;
  movement: string | null;
  palm_orientation: string | null;
  non_manual: string | null;
  tip: string | null;
  media_path: string | null;
  media_type: TipoMidia | null;
  review_level: number;
  review_due_at: string;
  created_at: string;
  /** URL assinada (1 hora) para mostrar a mídia privada; null se não houver mídia. */
  media_url: string | null;
};

const COLUNAS =
  "id, kind, word, category, lesson, hand_shape, location, movement, palm_orientation, non_manual, tip, media_path, media_type, review_level, review_due_at, created_at";

const VALIDADE_URL_S = 60 * 60;

type Linha = Omit<Sinal, "media_url">;

async function comUrls(supabase: Awaited<ReturnType<typeof createClient>>, linhas: Linha[]): Promise<Sinal[]> {
  const caminhos = linhas.map((l) => l.media_path).filter((c): c is string => !!c);
  const urls = new Map<string, string>();
  if (caminhos.length) {
    const { data, error } = await supabase.storage.from(BUCKET_MIDIA).createSignedUrls(caminhos, VALIDADE_URL_S);
    if (error) console.error("createSignedUrls:", error.message);
    for (const d of data ?? []) if (d.path && d.signedUrl) urls.set(d.path, d.signedUrl);
  }
  return linhas.map((l) => ({ ...l, media_url: l.media_path ? (urls.get(l.media_path) ?? null) : null }));
}

/** Todos os sinais dela, mais novos primeiro (até 1000 — paginar quando passar disso). */
export async function listarSinais(): Promise<Sinal[] | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("signs")
    .select(COLUNAS)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) throw new Error(`Falha ao listar sinais: ${error.message}`);
  return comUrls(supabase, (data ?? []) as Linha[]);
}

/** Só as palavras guardadas (para o progresso das listas de estudo). */
export async function listarPalavras(): Promise<string[] | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("signs").select("word").eq("user_id", user.id).limit(5000);
  if (error) throw new Error(`Falha ao ler palavras: ${error.message}`);
  return (data ?? []).map((d) => d.word as string);
}

/** Um sinal dela; null se não existir ou não for dela (a RLS esconde os outros). */
export async function getSinal(id: string): Promise<Sinal | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("signs").select(COLUNAS).eq("id", id).eq("user_id", user.id).maybeSingle();
  if (error) throw new Error(`Falha ao ler sinal: ${error.message}`);
  if (!data) return null;
  const [sinal] = await comUrls(supabase, [data as Linha]);
  return sinal;
}

/**
 * Cartões da revisão: os vencidos (ou todos, no treino livre), mais atrasados primeiro.
 * `soComMidia` (modo "sinal → palavra") já filtra no banco, antes do limite.
 */
export async function listarParaRevisar(todos: boolean, soComMidia = false): Promise<Sinal[] | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  let consulta = supabase.from("signs").select(COLUNAS).eq("user_id", user.id);
  if (!todos) consulta = consulta.lte("review_due_at", new Date().toISOString());
  if (soComMidia) consulta = consulta.not("media_path", "is", null);
  const { data, error } = await consulta.order("review_due_at", { ascending: true }).limit(todos ? 500 : 100);
  if (error) throw new Error(`Falha ao ler revisão: ${error.message}`);
  return comUrls(supabase, (data ?? []) as Linha[]);
}

/** Resumo leve de todos os sinais (sem URLs), para a trilha de estrelas. */
export async function listarResumoSinais(): Promise<
  { word: string; category: string | null; lesson: string | null; review_level: number }[] | null
> {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("signs")
    .select("word, category, lesson, review_level")
    .eq("user_id", user.id)
    .limit(5000);
  if (error) throw new Error(`Falha ao ler sinais: ${error.message}`);
  return (data ?? []) as { word: string; category: string | null; lesson: string | null; review_level: number }[];
}
