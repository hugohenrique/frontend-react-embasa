import { useEffect, useState } from "react";
import { formatarData } from "../../shared/datas";
import { MensagemDeErro } from "../../shared/ui/MensagemDeErro";
import { buscarSolicitacao } from "./api";
import { HistoricoSolicitacao } from "./components/HistoricoSolicitacao";
import SeloStatus from "./components/SeloStatus";
import { nomesDasPrioridades, nomesDosTipos } from "./nomes";
import type { SolicitacaoDetalhada } from "./tipos";

type Situacao = "carregando" | "erro" | "pronto";

type DetalheSolicitacaoProps = {
  numero: string;
  aoFechar: () => void;
};

// O painel de uma solicitação. Como a página, ele guarda estado e busca na API;
// por isso fica na raiz da feature, e não em components.
export function DetalheSolicitacao({ numero, aoFechar }: DetalheSolicitacaoProps) {
  const [detalhe, setDetalhe] = useState<SolicitacaoDetalhada | null>(null);
  const [situacao, setSituacao] = useState<Situacao>("carregando");
  const [tentativa, setTentativa] = useState(0);

  // O mesmo padrão de ontem: carregar, com ignorar e tentativa
  useEffect(() => {
    let ignorar = false;

    async function carregar() {
      try {
        const dados = await buscarSolicitacao(numero);
        if (ignorar) return;
        setDetalhe(dados);
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
  }, [numero, tentativa]);

  function tentarDeNovo() {
    setSituacao("carregando");
    setTentativa(tentativa + 1);
  }

  return (
    <section className="cartao detalhe" aria-labelledby="detalhe-titulo">
      <div className="detalhe-topo">
        <h2 id="detalhe-titulo">Solicitação {numero}</h2>
        <button type="button" className="botao-linha" onClick={aoFechar}>Fechar</button>
      </div>

      {situacao === "carregando" && <p className="vazio" role="status">Carregando…</p>}
      {situacao === "erro" && (
        <MensagemDeErro texto="Não foi possível abrir a solicitação." aoTentarDeNovo={tentarDeNovo} />
      )}
      {situacao === "pronto" && detalhe && (
        <>
          <SeloStatus status={detalhe.status} />
          <dl className="ficha">
            <dt>Serviço</dt><dd>{nomesDosTipos[detalhe.tipo]}</dd>
            <dt>Local</dt><dd>{detalhe.bairro}, {detalhe.municipio}</dd>
            <dt>Prioridade</dt><dd>{nomesDasPrioridades[detalhe.prioridade]}</dd>
            <dt>Abertura</dt><dd>{formatarData(detalhe.abertura)}</dd>
            <dt>Relato</dt><dd>{detalhe.relato || "Sem relato."}</dd>
          </dl>
          <h3>Histórico</h3>
          <HistoricoSolicitacao eventos={detalhe.historico} />
        </>
      )}
    </section>
  );
}
