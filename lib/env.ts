// Variáveis públicas do Supabase (podem ir para o navegador).
// Falha alto e claro se faltar alguma: melhor um erro óbvio do que um app
// que "funciona pela metade" com valor errado.
//
// Atenção: o Next.js só embute no navegador as variáveis NEXT_PUBLIC_ lidas
// de forma literal (process.env.NOME). Por isso cada uma é lida aqui pelo nome.

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Variável de ambiente ${name} não definida. Copie .env.example para .env.local e preencha (veja docs/SETUP.md).`,
    );
  }
  return value;
}

export function supabaseEnv() {
  return {
    url: required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
    publishableKey: required(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    ),
  };
}
