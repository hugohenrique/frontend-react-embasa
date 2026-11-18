import { useEffect, useState } from "react";
import { Cartao } from "../../shared/ui/Cartao";
import { MensagemDeErro } from "../../shared/ui/MensagemDeErro";
import { listarOrdens } from "./api";
import type { OrdemDeServico } from "./tipos";

type Situacao = "carregando" | "erro" | "pronto";

// A página das ordens de serviço: guarda o estado e conversa com a API pelo api.ts
export function PaginaOrdens() {
  const [lista, setLista] = useState<OrdemDeServico[]>([]);
  const [total, setTotal] = useState(0);
  const [situacao, setSituacao] = useState<Situacao>("carregando");
  const [tentativa, setTentativa] = useState(0);

  // O mesmo carregamento de solicitações: ignorar, tentativa e três situações
  useEffect(() => {
    let ignorar = false;

    async function carregar() {
      try {
        const resposta = await listarOrdens({ status: "todos", pagina: 1 });
        if (ignorar) return;
        setLista(resposta.itens);
        setTotal(resposta.total);
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
  }, [tentativa]);

  function tentarDeNovo() {
    setSituacao("carregando");
    setTentativa(tentativa + 1);
  }

  return (
    <>
      <h1>Ordens de serviço</h1>
      <Cartao titulo="Ordens de serviço de campo">
        {situacao === "carregando" && <p className="vazio" role="status">Carregando as ordens…</p>}
        {situacao === "erro" && (
          <MensagemDeErro texto="Não foi possível carregar as ordens." aoTentarDeNovo={tentarDeNovo} />
        )}
        {situacao === "pronto" && (
          <p>
            {total} ordens no total. A primeira da lista é a {lista[0]?.numero ?? "—"}.
          </p>
        )}
      </Cartao>
    </>
  );
}
