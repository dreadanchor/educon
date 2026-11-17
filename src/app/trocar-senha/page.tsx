import { Suspense } from "react";
import { redirect } from "next/navigation";
import { obterSessao } from "@/lib/auth/sessao";
import { FormularioTrocarSenha } from "./FormularioTrocarSenha";

export const metadata = { title: "Trocar senha · Educon" };

async function Texto() {
  const sessao = await obterSessao();
  if (!sessao) redirect("/login");
  return (
    <p className="mb-5 mt-1 text-sm text-zinc-600">
      {sessao.primeiroAcesso
        ? `Olá, ${sessao.nome}. No primeiro acesso você precisa criar uma senha nova.`
        : "Escolha uma senha nova."}
    </p>
  );
}

export default function PaginaTrocarSenha() {
  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Trocar senha</h1>
        <Suspense fallback={<p className="mb-5 mt-1 text-sm text-zinc-600">Carregando...</p>}>
          <Texto />
        </Suspense>
        <FormularioTrocarSenha />
      </div>
    </main>
  );
}
