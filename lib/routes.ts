// Regras de rotas num lugar só (fácil de testar e de mudar por projeto).

/** Rotas que exigem login. Adicione aqui as áreas privadas do seu app. */
export const PRIVATE_PREFIXES = ["/painel", "/caderno"];

export function isPrivatePath(pathname: string): boolean {
  return PRIVATE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Garante que o redirecionamento depois do login fica DENTRO do app.
 * Sem isso, alguém poderia mandar um link ".../login?next=https://site-falso.com"
 * e usar o seu app para levar a vítima a um site de phishing ("open redirect").
 */
export function safeNextPath(next: string | null | undefined, fallback = "/painel"): string {
  if (!next) return fallback;
  // Precisa começar com "/" e não pode começar com "//" ou "/\" (que o navegador
  // interpreta como outro domínio).
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return fallback;
  }
  return next;
}
