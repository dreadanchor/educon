import { describe, expect, it } from "vitest";
import { formatarTelefone, validarTelefone } from "./telefone";

describe("Telefone", () => {
  it("aceita 10 ou 11 dígitos", () => {
    expect(validarTelefone("(83) 99999-8888")).toBe(true);
    expect(validarTelefone("8333334444")).toBe(true);
  });
  it("rejeita outros tamanhos", () => {
    expect(validarTelefone("999998888")).toBe(false);
    expect(validarTelefone("839999988889")).toBe(false);
  });
  it("formata celular e fixo", () => {
    expect(formatarTelefone("83999998888")).toBe("(83) 99999-8888");
    expect(formatarTelefone("8333334444")).toBe("(83) 3333-4444");
  });
});
