import { describe, expect, it } from "vitest";
import {
  gerarSenhaInicialProfessor,
  gerarUsuarioProfessor,
  senhaInicialAluno,
  usuarioParaEmail,
} from "./acesso";

describe("Usuário do professor", () => {
  it("usa nome.sobrenome sem acento e minúsculo", () => {
    expect(gerarUsuarioProfessor("Camila Rocha")).toBe("camila.rocha");
    expect(gerarUsuarioProfessor("José Conceição Araújo")).toBe("jose.araujo");
  });
  it("ignora títulos com ponto", () => {
    expect(gerarUsuarioProfessor("Prof.ª Camila Rocha")).toBe("camila.rocha");
    expect(gerarUsuarioProfessor("Dr. João Silva")).toBe("joao.silva");
  });
  it("numera quando já existe", () => {
    expect(gerarUsuarioProfessor("Ana Souza", ["ana.souza"])).toBe("ana.souza2");
    expect(gerarUsuarioProfessor("Ana Souza", ["ana.souza", "ana.souza2"])).toBe("ana.souza3");
  });
  it("exige nome e sobrenome", () => {
    expect(gerarUsuarioProfessor("Camila")).toBeNull();
    expect(gerarUsuarioProfessor("Prof. Camila")).toBeNull();
    expect(gerarUsuarioProfessor("")).toBeNull();
  });
});

describe("Senha inicial", () => {
  it("professor: sobrenome + nome + 4 últimos dígitos do celular", () => {
    expect(gerarSenhaInicialProfessor("Camila Rocha", "(83) 99999-8888")).toBe("rochacamila8888");
    expect(gerarSenhaInicialProfessor("Prof.ª José Araújo", "83988887777")).toBe("araujojose7777");
  });
  it("professor: null sem sobrenome ou sem celular", () => {
    expect(gerarSenhaInicialProfessor("Camila", "83999998888")).toBeNull();
    expect(gerarSenhaInicialProfessor("Camila Rocha", "123")).toBeNull();
  });
  it("aluno: a própria matrícula", () => {
    expect(senhaInicialAluno("2026001")).toBe("2026001");
  });
});

describe("E-mail interno", () => {
  it("converte usuário em e-mail", () => {
    expect(usuarioParaEmail("lucas.ariete")).toBe("lucas.ariete@educon.app");
    expect(usuarioParaEmail(" 2026001 ")).toBe("2026001@educon.app");
  });
});
