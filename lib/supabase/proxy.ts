// Renova a sessão do Supabase a cada requisição e protege as rotas privadas.
// Chamado pelo proxy.ts da raiz (no Next.js 16, "middleware" virou "proxy").
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseEnv } from "@/lib/env";
import { isPrivatePath } from "@/lib/routes";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { url, publishableKey } = supabaseEnv();

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // IMPORTANTE: não coloque código entre a criação do cliente e getClaims().
  // É essa chamada que renova o token e evita logouts aleatórios.
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = Boolean(data?.claims);

  if (!isLoggedIn && isPrivatePath(request.nextUrl.pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Marca de qual conta é esta resposta (resumo do id, não o id). O service worker
  // (public/sw.js) apaga as telas e fotos guardadas quando a conta muda (privacidade).
  response.headers.set("x-incluir-conta", isLoggedIn ? await marcaDaConta(String(data!.claims.sub)) : "anon");
  return response;
}

async function marcaDaConta(id: string): Promise<string> {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`incluir:${id}`));
  return Array.from(new Uint8Array(bytes).slice(0, 8), (b) => b.toString(16).padStart(2, "0")).join("");
}
