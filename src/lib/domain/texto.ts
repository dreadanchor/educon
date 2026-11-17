/** Minúsculas e sem acentos: "Conceição" -> "conceicao". */
export function semAcento(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function somenteDigitos(texto: string): string {
  return texto.replace(/\D/g, "");
}
