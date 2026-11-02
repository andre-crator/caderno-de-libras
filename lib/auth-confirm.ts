import type { EmailOtpType } from "@supabase/supabase-js";
import { safeNextPath } from "@/lib/routes";

// Tipos de link de e-mail que o Supabase envia com token_hash.
const EMAIL_OTP_TYPES: readonly EmailOtpType[] = [
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
];

export type ConfirmParams = {
  tokenHash: string;
  type: EmailOtpType;
  next: string;
};

/**
 * Lê os parâmetros do link de confirmação (`?token_hash=...&type=...&next=...`).
 * Devolve null se faltar algo ou se o tipo for desconhecido. O `next` sempre
 * passa por safeNextPath (nada de redirecionar para fora do app).
 */
export function parseConfirmParams(params: URLSearchParams): ConfirmParams | null {
  const tokenHash = params.get("token_hash");
  const type = params.get("type");
  if (!tokenHash || !type) return null;
  if (!EMAIL_OTP_TYPES.includes(type as EmailOtpType)) return null;
  return {
    tokenHash,
    type: type as EmailOtpType,
    next: safeNextPath(params.get("next")),
  };
}
