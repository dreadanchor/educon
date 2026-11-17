import { describe, expect, it } from "vitest";
import { alunosParaEnturmar, podeEnturmar } from "./enturmacao";

describe("Enturmação", () => {
  it("só no mesmo segmento", () => {
    expect(podeEnturmar({ segmento: "fundamental_1" }, { segmento: "fundamental_1" })).toBe(true);
    expect(podeEnturmar({ segmento: "educacao_infantil" }, { segmento: "fundamental_1" })).toBe(false);
  });
  it("lista só alunos do segmento e sem turma", () => {
    const alunos = [
      { id: 1, segmento: "fundamental_1" as const, turmaId: null },
      { id: 2, segmento: "fundamental_1" as const, turmaId: "t1" },
      { id: 3, segmento: "educacao_infantil" as const, turmaId: null },
    ];
    expect(alunosParaEnturmar(alunos, { segmento: "fundamental_1" }).map((a) => a.id)).toEqual([1]);
  });
});
