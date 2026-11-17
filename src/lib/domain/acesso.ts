import { normalizarTelefone } from "./telefone";
import { semAcento } from "./texto";

/** Palavras com ponto são títulos ("Prof.ª", "Dr.") e não contam como nome. */
function partesDoNome(nomeCompleto: string): string[] {
  return nomeCompleto
    .trim()
    .split(/\s+/)
    .filter((p) => p && !p.includes("."))
    .map((p) => semAcento(p).replace(/[^a-z0-9]/g, ""))
    .filter(Boolean);
}

/** Exige nome e sobrenome. Devolve null se faltar algum. */
function nomeESobrenome(nomeCompleto: string): { nome: string; sobrenome: string } | null {
  const partes = partesDoNome(nomeCompleto);
  if (partes.length < 2) return null;
  return { nome: partes[0], sobrenome: partes[partes.length - 1] };
}

/**
 * Usuário do professor: nome.sobrenome, minúsculo e sem acento.
 * Se já existir, vira ana.souza2, ana.souza3...
 */
export function gerarUsuarioProfessor(
  nomeCompleto: string,
  usuariosExistentes: Iterable<string> = [],
): string | null {
  const partes = nomeESobrenome(nomeCompleto);
  if (!partes) return null;
  const existentes = new Set([...usuariosExistentes].map((u) => u.toLowerCase()));
  const base = `${partes.nome}.${partes.sobrenome}`;
  if (!existentes.has(base)) return base;
  let n = 2;
  while (existentes.has(`${base}${n}`)) n++;
  return `${base}${n}`;
}

/**
 * Senha inicial do professor: sobrenome + nome + 4 últimos dígitos do celular
 * (ex.: rochacamila8888). Devolve null se faltar nome/sobrenome ou celular válido.
 */
export function gerarSenhaInicialProfessor(
  nomeCompleto: string,
  celular: string,
): string | null {
  const partes = nomeESobrenome(nomeCompleto);
  const digitos = normalizarTelefone(celular);
  if (!partes || digitos.length < 4) return null;
  return `${partes.sobrenome}${partes.nome}${digitos.slice(-4)}`;
}

/** Aluno: a senha inicial é a própria matrícula. */
export function senhaInicialAluno(matricula: string): string {
  return matricula;
}

const DOMINIO_INTERNO = "educon.app";

/** O Supabase exige e-mail: "lucas.ariete" -> "lucas.ariete@educon.app". */
export function usuarioParaEmail(usuario: string): string {
  return `${usuario.trim().toLowerCase()}@${DOMINIO_INTERNO}`;
}
