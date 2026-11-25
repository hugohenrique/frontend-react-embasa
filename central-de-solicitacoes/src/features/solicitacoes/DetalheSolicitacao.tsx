import { useState } from "react";
import { useCarregar } from "../../shared/hooks/useCarregar";
import { formatarData } from "../../shared/datas";
import { Carregamento } from "../../shared/ui/Carregamento";
import { buscarSolicitacao, mudarStatus } from "./api";
import { HistoricoSolicitacao } from "./components/HistoricoSolicitacao";
import { SeloStatus } from "./components/SeloStatus";
import { acoesDosStatus, nomesDasPrioridades, nomesDosTipos } from "./nomes";
import { proximosStatus } from "./regras";
import type { Status } from "./tipos";
import { Link } from "react-router";

type DetalheSolicitacaoProps = {
  numero: string;
};

// O painel de uma solicitação. Como a página, ele guarda estado e busca na API;
// por isso fica na raiz da feature, e não em components.
export function DetalheSolicitacao({ numero }: DetalheSolicitacaoProps) {
  const [salvando, setSalvando] = useState(false);
  const [erroDaAcao, setErroDaAcao] = useState("");
  const [observacao, setObservacao] = useState("");

  // A chave é o número: outra solicitação, outra busca
  const painel = useCarregar(numero, () => buscarSolicitacao(numero));
  const detalhe = painel.dados;

  // Pede a mudança à API e mostra o que ela respondeu
  async function mudarPara(status: Status) {
    setSalvando(true);
    setErroDaAcao("");
    try {
      const resultado = await mudarStatus(numero, status, observacao);
      if (resultado.tipo === "alterada") {
        painel.setDados(resultado.solicitacao);
        setObservacao("");
      } else if (resultado.tipo === "recusada") {
        setErroDaAcao(Object.values(resultado.campos).join(" "));
      } else {
        // Conflito: outra pessoa mudou antes. Mostra o aviso e busca a versão atual.
        setErroDaAcao(resultado.mensagem);
        const atual = await buscarSolicitacao(numero);
        painel.setDados(atual);
      }
    } catch (erro) {
      console.error(erro);
      setErroDaAcao("Não foi possível salvar agora. Tente de novo em instantes.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <section className="cartao detalhe" aria-labelledby="detalhe-titulo">
      <div className="detalhe-topo">
        <h2 id="detalhe-titulo">Solicitação {numero}</h2>
        <Link to="/solicitacoes" className="botao-linha">Fechar</Link>
      </div>

      <Carregamento
        situacao={painel.situacao}
        carregando="Carregando…"
        erro="Não foi possível abrir a solicitação."
        aoTentarDeNovo={painel.tentarDeNovo}
      >
        {/* O conteúdo é calculado antes de o Carregamento decidir: o detalhe ainda pode ser null */}
        {detalhe && (
          <>
            <SeloStatus status={detalhe.status} />
            <dl className="ficha">
              <dt>Serviço</dt><dd>{nomesDosTipos[detalhe.tipo]}</dd>
              <dt>Local</dt><dd>{detalhe.bairro}, {detalhe.municipio}</dd>
              <dt>Prioridade</dt><dd>{nomesDasPrioridades[detalhe.prioridade]}</dd>
              <dt>Abertura</dt><dd>{formatarData(detalhe.abertura)}</dd>
              <dt>Relato</dt><dd>{detalhe.relato || "Sem relato."}</dd>
            </dl>
            {proximosStatus(detalhe.status).length > 0 && (
              <div className="detalhe-acoes">
                <h3>O que fazer agora</h3>
                <label htmlFor="detalhe-observacao">Observação</label>
                <textarea
                  id="detalhe-observacao"
                  rows={3}
                  maxLength={300}
                  value={observacao}
                  onChange={(evento) => setObservacao(evento.target.value)}
                  aria-invalid={erroDaAcao ? true : undefined}
                  aria-describedby={erroDaAcao ? "detalhe-observacao-erro" : "detalhe-observacao-dica"}
                />
                {erroDaAcao ? (
                  <p className="erro-campo" id="detalhe-observacao-erro" role="alert">{erroDaAcao}</p>
                ) : (
                  <p className="contador" id="detalhe-observacao-dica">Obrigatória para concluir ou cancelar.</p>
                )}
                <div className="acoes">
                  {proximosStatus(detalhe.status).map((proximo) => (
                    <button
                      key={proximo}
                      type="button"
                      className={proximo === "cancelada" ? "botao-secundario" : undefined}
                      disabled={salvando}
                      onClick={() => mudarPara(proximo)}
                    >
                      {acoesDosStatus[proximo]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <h3>Histórico</h3>
            <HistoricoSolicitacao eventos={detalhe.historico} />
          </>
        )}
      </Carregamento>
    </section>
  );
}
