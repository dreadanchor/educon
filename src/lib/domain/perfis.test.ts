import { describe, expect, it } from "vitest";
import { ehPerfil, rotaProtegida, ROTA_DO_PERFIL } from "./perfis";

describe("Perfis", () => {
  it("reconhece só os três perfis", () => {
    expect(ehPerfil("coordenador")).toBe(true);
    expect(ehPerfil("admin")).toBe(false);
    expect(ehPerfil(undefined)).toBe(false);
  });
  it("cada perfil tem sua rota", () => {
    expect(ROTA_DO_PERFIL.aluno).toBe("/aluno");
  });
  it("protege as áreas internas e libera as públicas", () => {
    expect(rotaProtegida("/coordenacao")).toBe(true);
    expect(rotaProtegida("/professor/diario")).toBe(true);
    expect(rotaProtegida("/trocar-senha")).toBe(true);
    expect(rotaProtegida("/")).toBe(false);
    expect(rotaProtegida("/login")).toBe(false);
    expect(rotaProtegida("/alunos-antigos")).toBe(false);
  });
});
