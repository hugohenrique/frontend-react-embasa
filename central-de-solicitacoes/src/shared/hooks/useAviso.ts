import { useEffect, useState } from "react";

export function useAviso(duracao = 5000): [string, (texto: string) => void] {
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    if (aviso === "") {
      return;
    }
    const relogio = setTimeout(() => setAviso(""), duracao);
    return () => clearTimeout(relogio);
  }, [aviso, duracao]);

  return [aviso, setAviso];
}
