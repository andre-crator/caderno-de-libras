// Cliente Supabase para o SERVIDOR (Server Components, Route Handlers, Server Actions).
// Lê e grava a sessão nos cookies da requisição.
import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseEnv } from "@/lib/env";

export async function createClient() {
  const cookieStore = await cookies();
  const { url, publishableKey } = supabaseEnv();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Components não podem gravar cookies. Tudo bem: o proxy.ts
          // já renova a sessão a cada requisição.
        }
      },
    },
  });
}

/** Usuário logado (verificado) ou null. Use em páginas protegidas. */
export async function getCurrentUser() {
  const supabase = await createClient();
  // getClaims() valida o token (assinatura JWT). Nunca confie em getSession()
  // no servidor: ele só lê o cookie, sem verificar.
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) return null;
  return { id: data.claims.sub, email: data.claims.email as string | undefined };
}
