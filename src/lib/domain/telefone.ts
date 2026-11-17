import { somenteDigitos } from "./texto";

/** DDD + número: 10 ou 11 dígitos. */
export function validarTelefone(telefone: string): boolean {
  const n = somenteDigitos(telefone).length;
  return n === 10 || n === 11;
}

export function normalizarTelefone(telefone: string): string {
  return somenteDigitos(telefone);
}

/** 83999998888 -> (83) 99999-8888 ; 8333334444 -> (83) 3333-4444. */
export function formatarTelefone(telefone: string): string {
  const d = somenteDigitos(telefone);
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return telefone;
}
