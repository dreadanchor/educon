import { Suspense, type ReactNode } from "react";
import { CabecalhoArea } from "@/components/CabecalhoArea";
import { exigirPerfil } from "@/lib/auth/sessao";
import type { PerfilUsuario } from "@/lib/domain/perfis";

async function Conteudo({ perfil, titulo, children }: { perfil: PerfilUsuario; titulo: string; children: ReactNode }) {
  const sessao = await exigirPerfil(perfil);
  return (
    <>
      <CabecalhoArea titulo={titulo} nome={sessao.nome} />
      {children}
    </>
  );
}

/** Use no layout de cada área. A conferência de perfil acontece aqui, no servidor. */
export function AreaProtegida(props: { perfil: PerfilUsuario; titulo: string; children: ReactNode }) {
  return (
    <Suspense fallback={<p className="p-6 text-zinc-600">Carregando...</p>}>
      <Conteudo {...props} />
    </Suspense>
  );
}
