import { createContext, useContext } from "react";

// O Context guarda a função de mostrar aviso. Quem está dentro do provedor pode pegá-la.
export const AvisosContext = createContext<((texto: string) => void) | null>(null);

// Qualquer tela dentro do ProvedorDeAvisos mostra um aviso com uma linha
export function useMostrarAviso() {
  const mostrarAviso = useContext(AvisosContext);
  if (mostrarAviso === null) {
    throw new Error("useMostrarAviso precisa estar dentro do ProvedorDeAvisos.");
  }
  return mostrarAviso;
}
