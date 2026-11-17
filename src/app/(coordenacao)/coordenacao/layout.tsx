import type { ReactNode } from "react";
import { AreaProtegida } from "@/components/AreaProtegida";

export default function LayoutCoordenacao({ children }: { children: ReactNode }) {
  return (
    <AreaProtegida perfil="coordenador" titulo="Coordenação">
      {children}
    </AreaProtegida>
  );
}
