import { useEffect, useState } from "react";
import { Cartao } from "../../shared/ui/Cartao";
import { MensagemDeErro } from "../../shared/ui/MensagemDeErro";
import { Paginacao } from "../../shared/ui/Paginacao";
import { listarOrdens, POR_PAGINA } from "./api";
import type { FiltroStatusOrdem } from "./api";
import { TabelaOrdens } from "./components/TabelaOrdens";
import type { OrdemDeServico } from "./tipos";

type Situacao = "carregando" | "erro" | "pronto";

// A página das ordens de serviço: guarda o estado e conversa com a API pelo api.ts
export function PaginaOrdens() {
  const [lista, setLista] = useState<OrdemDeServico[]>([]);
  const [total, setTotal] = useState(0);
  const [situacao, setSituacao] = useState<Situacao>("carregando");
  const [tentativa, setTentativa] = useState(0);
  const [status, setStatus] = useState<FiltroStatusOrdem>("todos");
  const [pagina, setPagina] = useState(1);

  // O mesmo carregamento de solicitações: ignorar, tentativa e três situações
  useEffect(() => {
    let ignorar = false;

    async function carregar() {
      try {
        const resposta = await listarOrdens({ status, pagina });
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
  }, [status, pagina, tentativa]);

  // Filtro novo, resultado novo: volta para a página 1 (a lição do exercício de ontem)
  function mudarStatus(novo: FiltroStatusOrdem) {
    setStatus(novo);
    setPagina(1);
  }

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
          <>
            <div className="filtros">
              <div>
                <label htmlFor="filtro-status-ordem">Status</label>
                <select
                  id="filtro-status-ordem"
                  value={status}
                  onChange={(evento) => mudarStatus(evento.target.value as FiltroStatusOrdem)}
                >
                  <option value="todos">Todos</option>
                  <option value="programada">Programada</option>
                  <option value="em-execucao">Em execução</option>
                  <option value="impedida">Impedida</option>
                  <option value="concluida">Concluída</option>
                </select>
              </div>
            </div>
            <TabelaOrdens ordens={lista} total={total} />
            <Paginacao pagina={pagina} totalDePaginas={Math.ceil(total / POR_PAGINA)} aoMudar={setPagina} />
          </>
        )}
      </Cartao>
    </>
  );
}
