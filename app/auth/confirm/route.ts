// Para onde aponta o link dos e-mails do Supabase no formato novo
// (`/auth/confirm?token_hash=...&type=...`): confirmação de cadastro, link mágico,
// troca de e-mail e recuperação de senha. Valida o token e cria a sessão (cookies).
// Diferente do /auth/callback, funciona mesmo se o link for aberto em outro
// navegador ou aparelho (não depende do "code verifier" guardado no cadastro).
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseConfirmParams } from "@/lib/auth-confirm";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const params = parseConfirmParams(searchParams);

  if (params) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type: params.type,
      token_hash: params.tokenHash,
    });
    if (!error) {
      return NextResponse.redirect(`${origin}${params.next}`);
    }
    console.error("auth/confirm: falha ao validar o link", error.message);
  }

  return NextResponse.redirect(`${origin}/login?erro=confirmacao`);
}
