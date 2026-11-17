import type { ReactNode } from "react";
import { AreaProtegida } from "@/components/AreaProtegida";

export default function LayoutProfessor({ children }: { children: ReactNode }) {
  return (
    <AreaProtegida perfil="professor" titulo="Professor">
      {children}
    </AreaProtegida>
  );
}
