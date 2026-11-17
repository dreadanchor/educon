"use client";

import { useActionState } from "react";
import { entrar, type EstadoFormulario } from "@/lib/auth/acoes";
import { ROTULO_DO_PERFIL, PERFIS } from "@/lib/domain/perfis";
import { Campo, MensagemErro, classeBotao } from "@/components/Campo";

export function FormularioLogin() {
  const [estado, acao, pendente] = useActionState<EstadoFormulario, FormData>(entrar, {});

  return (
    <form action={acao} className="flex flex-col gap-4" noValidate>
      <Campo
        rotulo="Usuário ou matrícula"
        id="usuario"
        type="text"
        autoComplete="username"
        autoCapitalize="none"
        required
        defaultValue={estado.campos?.usuario}
      />
      <Campo rotulo="Senha" id="senha" type="password" autoComplete="current-password" required />
      <div className="flex flex-col gap-1">
        <label htmlFor="perfil" className="text-sm font-medium">
          Perfil
        </label>
        <select
          id="perfil"
          name="perfil"
          required
          defaultValue="aluno"
          className="rounded border border-zinc-400 bg-white px-3 py-2 text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-700"
        >
          {PERFIS.map((p) => (
            <option key={p} value={p}>
              {ROTULO_DO_PERFIL[p]}
            </option>
          ))}
        </select>
      </div>
      <MensagemErro erro={estado.erro} />
      <button type="submit" disabled={pendente} className={classeBotao}>
        {pendente ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
