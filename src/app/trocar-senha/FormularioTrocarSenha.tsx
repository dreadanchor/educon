"use client";

import { useActionState } from "react";
import { trocarSenha, type EstadoFormulario } from "@/lib/auth/acoes";
import { Campo, MensagemErro, classeBotao } from "@/components/Campo";

export function FormularioTrocarSenha() {
  const [estado, acao, pendente] = useActionState<EstadoFormulario, FormData>(trocarSenha, {});

  return (
    <form action={acao} className="flex flex-col gap-4" noValidate>
      <Campo rotulo="Nova senha (mínimo 8 caracteres)" id="novaSenha" type="password" autoComplete="new-password" required />
      <Campo rotulo="Repita a nova senha" id="confirmacao" type="password" autoComplete="new-password" required />
      <MensagemErro erro={estado.erro} />
      <button type="submit" disabled={pendente} className={classeBotao}>
        {pendente ? "Salvando..." : "Salvar nova senha"}
      </button>
    </form>
  );
}
