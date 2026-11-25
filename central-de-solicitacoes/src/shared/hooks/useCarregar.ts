import { useEffect, useEffectEvent, useState } from "react";
import type { Situacao } from "../ui/Carregamento";

// O carregamento do encontro 10, escrito uma vez só: ignorar, tentativa e três situações.
// Quem chama diz o que buscar e a chave do pedido. Mudou a chave, busca de novo.
export function useCarregar<T>(chave: string, buscar: () => Promise<T>) {
  const [dados, setDados] = useState<T | null>(null);
  const [situacao, setSituacao] = useState<Situacao>("carregando");
  const [tentativa, setTentativa] = useState(0);

  // Usa sempre o buscar mais novo, mas não é motivo para o efeito rodar de novo.
  // Regra: tudo o que o buscar usa e pode mudar precisa estar na chave.
  const buscarAgora = useEffectEvent(buscar);

  useEffect(() => {
    let ignorar = false;

    async function carregar() {
      try {
        const resposta = await buscarAgora();
        if (ignorar) return;
        setDados(resposta);
        setSituacao("pronto");
      } catch (erro) {
        if (ignorar) return;
        console.error(erro);
        setSituacao("erro");
      }
    }

    carregar();
    return () => {
      ignorar = true;
    };
  }, [chave, tentativa]);

  // Busca de novo sem trocar a tela por "Carregando" (depois de criar, ou de um 409)
  function recarregar() {
    setTentativa((atual) => atual + 1);
  }

  // O botão "Tentar de novo": mostra o carregando e busca
  function tentarDeNovo() {
    setSituacao("carregando");
    recarregar();
  }

  return { dados, situacao, setDados, recarregar, tentarDeNovo };
}
