export type PerfilUsuario = "coordenador" | "professor" | "aluno";

export const PERFIS: readonly PerfilUsuario[] = ["coordenador", "professor", "aluno"];

export const ROTA_DO_PERFIL: Record<PerfilUsuario, string> = {
  coordenador: "/coordenacao",
  professor: "/professor",
  aluno: "/aluno",
};

export const ROTULO_DO_PERFIL: Record<PerfilUsuario, string> = {
  coordenador: "Coordenação",
  professor: "Professor",
  aluno: "Aluno",
};

export function ehPerfil(valor: unknown): valor is PerfilUsuario {
  return typeof valor === "string" && (PERFIS as readonly string[]).includes(valor);
}

/** Páginas que exigem estar logado (o proxy redireciona para /login). */
export function rotaProtegida(caminho: string): boolean {
  return [...Object.values(ROTA_DO_PERFIL), "/trocar-senha"].some(
    (base) => caminho === base || caminho.startsWith(`${base}/`),
  );
}
