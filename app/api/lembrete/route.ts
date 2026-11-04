// Envio diário do lembrete (Vercel Cron, ver vercel.json). A Vercel chama com
// "Authorization: Bearer <CRON_SECRET>". A lista vem de lembretes_do_dia(segredo):
// o banco confere o segredo pelo hash, então aqui não há chave secreta do Supabase.
import { timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";
import { endpointPermitido } from "@/lib/meta/push";
import { mensagemDoLembrete } from "@/lib/meta/semana";

export const maxDuration = 60;
const LOTE = 20;

function segredoConfere(recebido: string | null, segredo: string): boolean {
  const a = Buffer.from(recebido ?? "");
  const b = Buffer.from(`Bearer ${segredo}`);
  return a.length === b.length && timingSafeEqual(a, b);
}

type Item = {
  endpoint: string;
  p256dh: string;
  auth: string;
  vencidos: number;
  estudou_hoje: boolean;
  dias_na_semana: number;
  meta: number;
};

export async function GET(request: Request) {
  const segredo = process.env.CRON_SECRET;
  const publica = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privada = process.env.VAPID_PRIVATE_KEY;
  if (!segredo || !segredoConfere(request.headers.get("authorization"), segredo)) {
    return new Response("não autorizado", { status: 401 });
  }
  if (!publica || !privada) return new Response("faltam as chaves do lembrete", { status: 500 });

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase.rpc("lembretes_do_dia", { segredo });
  if (error) {
    console.error("lembretes_do_dia:", error.message);
    return new Response("falha ao ler a lista", { status: 500 });
  }

  webpush.setVapidDetails("https://caderno-de-libras.vercel.app", publica, privada);
  let enviados = 0;
  let removidos = 0;
  async function enviar(item: Item) {
    if (!endpointPermitido(item.endpoint)) return;
    const msg = mensagemDoLembrete({ ...item, vencidos: Number(item.vencidos), dias_na_semana: Number(item.dias_na_semana) });
    if (!msg) return;
    try {
      await webpush.sendNotification(
        { endpoint: item.endpoint, keys: { p256dh: item.p256dh, auth: item.auth } },
        JSON.stringify(msg),
        { TTL: 6 * 60 * 60, urgency: "normal" },
      );
      enviados++;
    } catch (e) {
      const status = (e as { statusCode?: number }).statusCode;
      if (status === 404 || status === 410) {
        // O celular cancelou a inscrição (desinstalou, limpou dados): tira da lista.
        await supabase.rpc("apagar_inscricao_vencida", { segredo, alvo: item.endpoint });
        removidos++;
      } else {
        console.error("lembrete: falha no envio", status);
      }
    }
  }
  const itens = (data ?? []) as Item[];
  for (let i = 0; i < itens.length; i += LOTE) {
    await Promise.allSettled(itens.slice(i, i + LOTE).map(enviar));
  }
  return Response.json({ enviados, removidos });
}
