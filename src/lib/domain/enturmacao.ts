export type Segmento = "educacao_infantil" | "fundamental_1";

export interface AlunoEnturmavel {
  segmento: Segmento;
  turmaId: string | null;
}

/** Aluno só entra em turma do próprio segmento. */
export function podeEnturmar(aluno: { segmento: Segmento }, turma: { segmento: Segmento }) {
  return aluno.segmento === turma.segmento;
}

/** Alunos que aparecem para enturmar: mesmo segmento da turma e ainda sem turma. */
export function alunosParaEnturmar<T extends AlunoEnturmavel>(
  alunos: T[],
  turma: { segmento: Segmento },
): T[] {
  return alunos.filter((a) => a.segmento === turma.segmento && a.turmaId === null);
}
