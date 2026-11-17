import { createBrowserClient } from "@supabase/ssr";

/** Cliente do navegador: usa só a chave publishable (pública por desenho). */
export function criarClienteNavegador() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
