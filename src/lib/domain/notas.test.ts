import { describe, expect, it } from "vitest";
import { mediaBimestre, mediaGeral, validarNota } from "./notas";

describe("Notas", () => {
  it("valida de 0 a 10 com uma casa decimal", () => {
    expect(validarNota(0)).toBe(true);
    expect(validarNota(7.5)).toBe(true);
    expect(validarNota(10)).toBe(true);
    expect(validarNota(10.1)).toBe(false);
    expect(validarNota(-1)).toBe(false);
    expect(validarNota(7.55)).toBe(false);
    expect(validarNota(NaN)).toBe(false);
  });
  it("média do bimestre só com as duas notas", () => {
    expect(mediaBimestre(8, 6)).toBe(7);
    expect(mediaBimestre(8, null)).toBeNull();
    expect(mediaBimestre(undefined, 6)).toBeNull();
    expect(mediaBimestre(0, 0)).toBe(0);
  });
  it("média geral é a média das médias existentes", () => {
    expect(mediaGeral([7, null, 9])).toBe(8);
    expect(mediaGeral([null, undefined])).toBeNull();
    expect(mediaGeral([])).toBeNull();
  });
});
