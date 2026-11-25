import { createContext, useContext } from "react";

export const AvisosContext = createContext<((texto: string) => void | null)>(
  null
);

export default function useMostrarAviso() {
  const mostrarAviso = useContext(AvisosContext);
  if (mostrarAviso === null) {
    throw new Error("useMostrarAviso precisa estar dentro do ProvedorDeAvisos");
  }
  return mostrarAviso;
}
