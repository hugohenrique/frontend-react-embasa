import type { ReactNode } from "react";
import { useAviso } from "../hooks/useAviso";
import { Aviso } from "../ui/Aviso";
import { AvisosContext } from "./useMostrarAviso";

type ProvedorAvisosProps = {
  children: ReactNode;
};

// Um aviso só, para a Central inteira. Ele mora acima das rotas: trocar de tela não o apaga.
export function ProvedorAvisos({ children }: ProvedorAvisosProps) {
  const [aviso, setAviso] = useAviso();

  return (
    <AvisosContext value={setAviso}>
      {children}
      {/* A região existe sempre, para o leitor de tela anunciar quando o aviso aparecer */}
      <div className="avisos" role="status">
        {aviso && <Aviso texto={aviso} aoFechar={() => setAviso("")} />}
      </div>
    </AvisosContext>
  );
}
