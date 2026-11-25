import { type ReactNode } from "react";
import { AvisosContext } from "./useMostrarAviso";
import { useAviso } from "../hooks/useAviso";
import { Aviso } from "../ui/Aviso";

type ProvedorDeAvisosProps = {
  children: ReactNode
};

export default function ProvedorDeAvisos({ children }: ProvedorDeAvisosProps) {
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
