/** Nota válida: de 0 a 10, com no máximo uma casa decimal. */
export function validarNota(nota: number): boolean {
  return (
    Number.isFinite(nota) &&
    nota >= 0 &&
    nota <= 10 &&
    Math.abs(nota * 10 - Math.round(nota * 10)) < 1e-9
  );
}

/** Média do bimestre = (N1 + N2) / 2, só quando as duas notas existem. */
export function mediaBimestre(
  n1: number | null | undefined,
  n2: number | null | undefined,
): number | null {
  if (n1 == null || n2 == null) return null;
  return (n1 + n2) / 2;
}

/** Média geral = média das médias que existem; null se não houver nenhuma. */
export function mediaGeral(medias: Array<number | null | undefined>): number | null {
  const existentes = medias.filter((m): m is number => m != null);
  if (existentes.length === 0) return null;
  return existentes.reduce((a, b) => a + b, 0) / existentes.length;
}
