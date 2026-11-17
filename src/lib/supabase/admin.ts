import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Cliente administrativo (chave secret). Ignora a RLS.
 * Só para Server Actions / Route Handlers que criam ou apagam contas.
 * Nunca importar em componente de cliente.
 */
export function criarClienteAdmin() {
  const chave = process.env.SUPABASE_SECRET_KEY;
  if (!chave) {
    throw new Error("SUPABASE_SECRET_KEY não configurada no .env.local.");
  }
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, chave, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
