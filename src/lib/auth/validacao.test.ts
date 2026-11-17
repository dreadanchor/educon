import { describe, expect, it } from "vitest";
import { loginSchema, trocarSenhaSchema } from "./validacao";

describe("login", () => {
  it("aceita dados completos", () => {
    expect(loginSchema.safeParse({ usuario: " lucas.ariete ", senha: "x", perfil: "coordenador" }).success).toBe(true);
  });
  it("rejeita campos vazios e perfil inválido", () => {
    expect(loginSchema.safeParse({ usuario: "", senha: "x", perfil: "aluno" }).success).toBe(false);
    expect(loginSchema.safeParse({ usuario: "a", senha: "", perfil: "aluno" }).success).toBe(false);
    expect(loginSchema.safeParse({ usuario: "a", senha: "x", perfil: "admin" }).success).toBe(false);
  });
});

describe("trocar senha", () => {
  it("aceita senha de 8+ caracteres confirmada", () => {
    expect(trocarSenhaSchema.safeParse({ novaSenha: "senhanova1", confirmacao: "senhanova1" }).success).toBe(true);
  });
  it("rejeita senha curta e confirmação diferente", () => {
    expect(trocarSenhaSchema.safeParse({ novaSenha: "curta", confirmacao: "curta" }).success).toBe(false);
    expect(trocarSenhaSchema.safeParse({ novaSenha: "senhanova1", confirmacao: "outra" }).success).toBe(false);
  });
});
