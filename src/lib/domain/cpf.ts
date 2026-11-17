import { somenteDigitos } from "./texto";

function digitoVerificador(base: string): number {
  const peso = base.length + 1;
  const soma = [...base].reduce((acc, d, i) => acc + Number(d) * (peso - i), 0);
  const resto = (soma * 10) % 11;
  return resto === 10 ? 0 : resto;
}

/** 11 dígitos, não repetidos, com os dois dígitos verificadores corretos. */
export function validarCpf(cpf: string): boolean {
  const d = somenteDigitos(cpf);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const d1 = digitoVerificador(d.slice(0, 9));
  const d2 = digitoVerificador(d.slice(0, 9) + d1);
  return d === d.slice(0, 9) + d1 + d2;
}

/** Guarda só dígitos (é o formato salvo no banco). */
export function normalizarCpf(cpf: string): string {
  return somenteDigitos(cpf);
}

/** 00000000000 -> 000.000.000-00 (só formata se tiver 11 dígitos). */
export function formatarCpf(cpf: string): string {
  const d = somenteDigitos(cpf);
  if (d.length !== 11) return cpf;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}
