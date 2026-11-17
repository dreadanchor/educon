import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/server";
import { ehPerfil, ROTA_DO_PERFIL, type PerfilUsuario } from "@/lib/domain/perfis";

export interface Sessao {
  id: string;
  perfil: PerfilUsuario;
  nome: string;
  usuario: string;
  primeiroAcesso: boolean;
}

/**
 * Quem está logado, conferido no servidor do Supabase (getUser) e no banco (perfis).
 * Devolve null se não há sessão, se não há perfil ou se a conta está inativa.
 */
export const obterSessao = cache(async (): Promise<Sessao | null> => {
  const supabase = await criarClienteServidor();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data: perfil } = await supabase
    .from("perfis")
    .select("perfil, nome, usuario, primeiro_acesso, ativo")
    .eq("id", auth.user.id)
    .maybeSingle();

  if (!perfil || !perfil.ativo || !ehPerfil(perfil.perfil)) return null;

  return {
    id: auth.user.id,
    perfil: perfil.perfil,
    nome: perfil.nome,
    usuario: perfil.usuario,
    primeiroAcesso: perfil.primeiro_acesso,
  };
});

/** Use nos layouts de cada área: só entra quem tem o perfil certo e já trocou a senha. */
export async function exigirPerfil(perfil: PerfilUsuario): Promise<Sessao> {
  const sessao = await obterSessao();
  if (!sessao) redirect("/login");
  if (sessao.primeiroAcesso) redirect("/trocar-senha");
  if (sessao.perfil !== perfil) redirect(ROTA_DO_PERFIL[sessao.perfil]);
  return sessao;
}
