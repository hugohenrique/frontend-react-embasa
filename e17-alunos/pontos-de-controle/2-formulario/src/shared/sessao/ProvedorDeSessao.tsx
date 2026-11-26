import { useState } from "react";
import type { ReactNode } from "react";
import { SessaoContext } from "./SessaoContext";
import type { Usuario } from "./SessaoContext";

type ProvedorDeSessaoProps = {
  children: ReactNode;
};

// Guarda quem está logado e entrega para a Central inteira.
// Quando o usuário muda, todo componente que lê a sessão é desenhado de novo.
export function ProvedorDeSessao({ children }: ProvedorDeSessaoProps) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  return (
    <SessaoContext value={{ usuario, entrar: setUsuario, sair: () => setUsuario(null) }}>
      {children}
    </SessaoContext>
  );
}
