// Cliente Supabase para o NAVEGADOR (Client Components: "use client").
// Usa só a chave pública (publishable). Quem protege os dados é a RLS do banco.
import { createBrowserClient } from "@supabase/ssr";
import { supabaseEnv } from "@/lib/env";

export function createClient() {
  const { url, publishableKey } = supabaseEnv();
  return createBrowserClient(url, publishableKey);
}
