import { Suspense } from "react";
import { redirect } from "next/navigation";
import { obterSessao } from "@/lib/auth/sessao";
import { ROTA_DO_PERFIL } from "@/lib/domain/perfis";
import { FormularioLogin } from "./FormularioLogin";

export const metadata = { title: "Entrar · Educon" };

/** Quem já está logado não precisa ver o login: vai direto para a sua área. */
async function RedirecionarSeLogado() {
  const sessao = await obterSessao();
  if (sessao) redirect(sessao.primeiroAcesso ? "/trocar-senha" : ROTA_DO_PERFIL[sessao.perfil]);
  return null;
}

export default function PaginaLogin() {
  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <Suspense>
        <RedirecionarSeLogado />
      </Suspense>
      <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Entrar</h1>
        <p className="mb-5 mt-1 text-sm text-zinc-600">Colégio Primeiro Sol</p>
        <FormularioLogin />
      </div>
    </main>
  );
}
