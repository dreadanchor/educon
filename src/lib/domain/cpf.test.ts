import { describe, expect, it } from "vitest";
import { formatarCpf, normalizarCpf, validarCpf } from "./cpf";

describe("CPF", () => {
  it("aceita CPF válido, com ou sem máscara", () => {
    expect(validarCpf("529.982.247-25")).toBe(true);
    expect(validarCpf("52998224725")).toBe(true);
  });
  it("rejeita sequências repetidas", () => {
    expect(validarCpf("111.111.111-11")).toBe(false);
    expect(validarCpf("00000000000")).toBe(false);
  });
  it("rejeita dígito verificador errado e tamanho errado", () => {
    expect(validarCpf("529.982.247-24")).toBe(false);
    expect(validarCpf("529.982.247-2")).toBe(false);
    expect(validarCpf("")).toBe(false);
  });
  it("normaliza e formata", () => {
    expect(normalizarCpf("529.982.247-25")).toBe("52998224725");
    expect(formatarCpf("52998224725")).toBe("529.982.247-25");
  });
});
