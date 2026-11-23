import { useEffect, useState } from "react";

// Um useState que se apaga sozinho: o aviso some depois de alguns segundos.
// Cada página que chama tem o seu próprio aviso: o hook reaproveita a lógica, não o estado.
export function useAviso(duracao = 5000): [string, (texto: string) => void] {
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    if (aviso === "") return;
    const relogio = setTimeout(() => setAviso(""), duracao);
    return () => clearTimeout(relogio);
  }, [aviso, duracao]);

  return [aviso, setAviso];
}
