import type { ReactNode } from "react";
import { AreaProtegida } from "@/components/AreaProtegida";

export default function LayoutAluno({ children }: { children: ReactNode }) {
  return (
    <AreaProtegida perfil="aluno" titulo="Aluno">
      {children}
    </AreaProtegida>
  );
}
