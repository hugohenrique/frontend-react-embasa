import { useState } from "react";
import { Link } from "react-router";
import { useCarregar } from "../../shared/hooks/useCarregar";
import { useSessao } from "../../shared/sessao/SessaoContext";
import { formatarData } from "../../shared/datas";
import { Carregamento } from "../../shared/ui/Carregamento";
import { buscarSolicitacao, mudarStatus } from "./api";
import { HistoricoSolicitacao } from "./components/HistoricoSolicitacao";
import { SeloStatus } from "./components/SeloStatus";
import { acoesStatus, nomesPrioridades, nomesTipos } from "./nomes";
import { proximosStatus } from "./regras";
import type { Solicitacao, Status } from "./tipos";

type DetalheSolicitacaoProps = {
  numero: string;
  aoAlterar: (solicitacao: Solicitacao) => void;
};

// O painel de uma solicitação. Como a página, ele guarda estado e busca na API;
// por isso fica na raiz da feature, e não em components.
export function DetalheSolicitacao({ numero, aoAlterar }: DetalheSolicitacaoProps) {
  const [estaSalvando, setEstaSalvando] = useState(false);
  const [erroAcao, setErroAcao] = useState("");
  const [observacao, setObservacao] = useState("");
  // A mesma sessão do cabeçalho, lida aqui também: nenhuma Prop passou por isso
  const { usuario } = useSessao();

  // A chave é o número: outra solicitação, outra busca
  const painel = useCarregar(numero, () => buscarSolicitacao(numero));
  const detalhe = painel.dados;

  // Só o supervisor cancela. Esconder o botão ajuda quem usa; quem garante a regra é a API.
  const acoesPermitidas = detalhe
    ? proximosStatus(detalhe.status).filter(
        (proximo) => proximo !== "cancelada" || usuario?.perfil === "supervisor",
      )
    : [];

  // Pede a mudança à API e mostra o que ela respondeu
  async function mudarPara(status: Status) {
    setEstaSalvando(true);
    setErroAcao("");
    try {
      const resultado = await mudarStatus(numero, status, observacao);
      if (resultado.tipo === "alterada") {
        painel.setDados(resultado.solicitacao);
        aoAlterar(resultado.solicitacao);
        setObservacao("");
      } else if (resultado.tipo === "recusada") {
        setErroAcao(Object.values(resultado.campos).join(" "));
      } else {
        // Conflito: outra pessoa mudou antes. Mostra o aviso e busca a versão atual.
        setErroAcao(resultado.mensagem);
        const atual = await buscarSolicitacao(numero);
        painel.setDados(atual);
        aoAlterar(atual);
      }
    } catch (erro) {
      console.error(erro);
      setErroAcao("Não foi possível salvar agora. Tente de novo em instantes.");
    } finally {
      setEstaSalvando(false);
    }
  }

  return (
    <section className="cartao detalhe" aria-labelledby="detalhe-titulo">
      <div className="detalhe-topo">
        <h2 id="detalhe-titulo">Solicitação {numero}</h2>
        {/* Fechar volta para o endereço da lista, sem número */}
        <Link to="/solicitacoes" className="botao-linha">Fechar</Link>
      </div>

      <Carregamento
        situacao={painel.situacao}
        carregando="Carregando…"
        erro="Não foi possível abrir a solicitação."
        aoTentarNovamente={painel.tentarNovamente}
      >
        {/* O conteúdo é calculado antes de o Carregamento decidir: o detalhe ainda pode ser null */}
        {detalhe && (
          <>
            <SeloStatus status={detalhe.status} />
            <dl className="ficha">
              <dt>Serviço</dt><dd>{nomesTipos[detalhe.tipo]}</dd>
              <dt>Local</dt><dd>{detalhe.bairro}, {detalhe.municipio}</dd>
              <dt>Prioridade</dt><dd>{nomesPrioridades[detalhe.prioridade]}</dd>
              <dt>Abertura</dt><dd>{formatarData(detalhe.abertura)}</dd>
              <dt>Relato</dt><dd>{detalhe.relato || "Sem relato."}</dd>
            </dl>
            {acoesPermitidas.length > 0 && (
              <div className="detalhe-acoes">
                <h3>O que fazer agora</h3>
                {usuario && <p className="contador">Você está atendendo como {usuario.nome}.</p>}
                <label htmlFor="detalhe-observacao">Observação</label>
                <textarea
                  id="detalhe-observacao"
                  rows={3}
                  maxLength={300}
                  value={observacao}
                  onChange={(evento) => setObservacao(evento.target.value)}
                  aria-invalid={erroAcao ? true : undefined}
                  aria-describedby={erroAcao ? "detalhe-observacao-erro" : "detalhe-observacao-dica"}
                />
                {erroAcao ? (
                  <p className="erro-campo" id="detalhe-observacao-erro" role="alert">{erroAcao}</p>
                ) : (
                  <p className="contador" id="detalhe-observacao-dica">Obrigatória para concluir ou cancelar.</p>
                )}
                <div className="acoes">
                  {acoesPermitidas.map((proximo) => (
                    <button
                      key={proximo}
                      type="button"
                      className={proximo === "cancelada" ? "botao-secundario" : undefined}
                      disabled={estaSalvando}
                      onClick={() => mudarPara(proximo)}
                    >
                      {acoesStatus[proximo]}
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
