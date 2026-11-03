// Sair da conta. É POST (não GET) de propósito: um link GET poderia ser
// disparado por outro site sem o usuário querer.
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const resposta = NextResponse.redirect(new URL("/login", request.url), { status: 303 });
  // Apaga do celular as telas e fotos guardadas para uso offline (privacidade).
  resposta.headers.set("Clear-Site-Data", '"cache", "storage"');
  return resposta;
}
