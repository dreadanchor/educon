"use server";

import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/server";
import { usuarioParaEmail } from "@/lib/domain/acesso";
import { ehPerfil, ROTA_DO_PERFIL } from "@/lib/domain/perfis";
import { loginSchema, trocarSenhaSchema } from "./validacao";

export interface EstadoFormulario {
  erro?: string;
  campos?: Record<string, string>;
}

const ERRO_LOGIN = "Usuário, senha ou perfil incorretos.";

export async function entrar(_: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  const dados = loginSchema.safeParse({
    usuario: formData.get("usuario"),
    senha: formData.get("senha"),
    perfil: formData.get("perfil"),
  });
  if (!dados.success) {
    return { erro: dados.error.issues[0].message, campos: { usuario: String(formData.get("usuario") ?? "") } };
  }
  const { usuario, senha, perfil } = dados.data;

  const supabase = await criarClienteServidor();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: usuarioParaEmail(usuario),
    password: senha,
  });
  if (error || !data.user) return { erro: ERRO_LOGIN, campos: { usuario } };

  const { data: registro } = await supabase
    .from("perfis")
    .select("perfil, primeiro_acesso, ativo")
    .eq("id", data.user.id)
    .maybeSingle();

  // Perfil escolhido diferente do cadastrado, conta inativa ou sem perfil: sai e usa a mesma mensagem.
  if (!registro || !registro.ativo || !ehPerfil(registro.perfil) || registro.perfil !== perfil) {
    await supabase.auth.signOut();
    return { erro: ERRO_LOGIN, campos: { usuario } };
  }

  redirect(registro.primeiro_acesso ? "/trocar-senha" : ROTA_DO_PERFIL[registro.perfil]);
}

export async function sair() {
  const supabase = await criarClienteServidor();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function trocarSenha(_: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  const dados = trocarSenhaSchema.safeParse({
    novaSenha: formData.get("novaSenha"),
    confirmacao: formData.get("confirmacao"),
  });
  if (!dados.success) return { erro: dados.error.issues[0].message };

  const supabase = await criarClienteServidor();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const { error } = await supabase.auth.updateUser({ password: dados.data.novaSenha });
  if (error) {
    const igual = /same|different/i.test(error.message);
    return { erro: igual ? "A nova senha precisa ser diferente da atual." : "Não foi possível trocar a senha. Tente novamente." };
  }

  const { error: erroRpc } = await supabase.rpc("concluir_primeiro_acesso");
  if (erroRpc) return { erro: "A senha foi trocada, mas houve um erro ao concluir o acesso. Tente novamente." };

  const { data: registro } = await supabase.from("perfis").select("perfil").eq("id", auth.user.id).maybeSingle();
  redirect(registro && ehPerfil(registro.perfil) ? ROTA_DO_PERFIL[registro.perfil] : "/login");
}
