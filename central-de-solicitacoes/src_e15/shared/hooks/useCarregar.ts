import { useEffect, useEffectEvent, useState, } from "react";
import type { Situacao } from "../ui/Carregamento";

export default function useCarregar<T>(chave: string, buscar: () => Promise<T>) {
  const [dados, setDados] = useState<T | null>(null);
  const [situacao, setSituacao] = useState<Situacao>("carregando");
  const [tentativa, setTentativa] = useState(0);

  const buscarAgora = useEffectEvent(buscar);

  useEffect(
    () => {
      let ignorar = false;
      async function carregar() {
        try {
          const resposta = await buscarAgora();
          if (ignorar) {
            return;
          }
          setDados(resposta);
          setSituacao("pronto")
        } catch (e) {
          if (ignorar) {
            return;
          }
          console.log(e);
          setSituacao("erro");
        }
      }

      carregar();

      return () => {
        ignorar = true;
      }
    },
    [chave, tentativa]
  );

  function recarregar() {
    setTentativa((atual) => atual + 1);
  }

  function tentarDeNovo() {
    setSituacao("carregando");
    recarregar();
  }

  return {
    dados,
    situacao,
    setDados,
    recarregar,
    tentarDeNovo
  };
};
