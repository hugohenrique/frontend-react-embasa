import { useState } from "react";
import { Cabecalho } from "./components/Cabecalho";
import { Cartao } from "./components/Cartao";
import { DicasAtendimento } from "./components/DicasAtendimento";
import { LinhaSolicitacao } from "./components/LinhaSolicitacao";
import { Rodape } from "./components/Rodape";
import { TentativasDeContato } from "./components/TentativasDeContato";
import { nomesDasPrioridades } from "./formatos";
import type { Prioridade } from "./tipos";
import { solicitacoes } from "./dados";

type FiltroPrioridade = Prioridade | "todas";

function App() {
  const [filtro, setFiltro] = useState<FiltroPrioridade>("todas");
  const [busca, setBusca] = useState("");

  const termo = busca.trim().toLowerCase();

  const visiveis = solicitacoes.filter(
    (solicitacao) => {
      return (filtro === "todas" || solicitacao.prioridade === filtro) &&
        solicitacao.bairro.toLowerCase().includes(termo);
    }
  );

  const urgentes = visiveis.filter(
    (solicitacao) => solicitacao.prioridade === 'alta'
  );

  return (
    <>
      <a href="#conteudo" className="pular-conteudo">Pular para o conteúdo</a>
      <Cabecalho />
      <main id="conteudo" className="pagina">
        <h1>Solicitações de serviço</h1>
        <p>Pedidos registrados pelo atendimento: vazamentos, falta d'água e religações.</p>

        <Cartao titulo="Dicas para registrar uma solicitação">
          <DicasAtendimento />
        </Cartao>

        <Cartao titulo="Solicitações recentes">
          <div className="filtros">
            <div>
              <label htmlFor="filtro-prioridade">Prioridade</label>
              <select
                id="filtro-prioridade"
                onChange={(evento) => setFiltro(evento.target.value as FiltroPrioridade)}
              >
                <option value="todas">Todas</option>
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="busca-bairro">Buscar por bairro</label>
            <input
              type="search"
              id="busca-bairro"
              onChange={(evento) => setBusca(evento.target.value)}
            />
          </div>
          <p className="total" aria-live="polite">
            {filtro === "todas" ? "Mostrando todas as prioridades." : `Mostrando só a prioridade ${nomesDasPrioridades[filtro]}.`}
          </p>
          {visiveis.length === 0 ? (
            <p className="vazio" role="status">
              Nenhuma solicitação encontrada. Confira o bairro digitado ou escolha outra prioridade.
            </p>
          ) : (
            <div className="tabela-rolagem" tabIndex={0} role="region" aria-label="Solicitações recentes">
              <table>
                <caption>Últimas solicitações abertas. Dados fictícios.</caption>
                <thead>
                  <tr>
                    <th scope="col">Nº</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Município</th>
                    <th scope="col">Bairro</th>
                    <th scope="col">Prioridade</th>
                    <th scope="col">Abertura</th>
                  </tr>
                </thead>
                <tbody>
                  {visiveis.map((solicitacao) => (
                    <LinhaSolicitacao key={solicitacao.numero} solicitacao={solicitacao} />
                  ))}
                </tbody>
                </table>
            </div>
            )}
          <caption style={{ display: 'block', marginTop: '10px' }}>Exibindo {visiveis.length} de {solicitacoes.length} solicitações.</caption>
        </Cartao>

        <Cartao titulo="Retorno ao cliente">
          {urgentes.length === 0 ? (
            <p className="vazio" role="status">
              Nenhuma solicitação de prioridade alta com os filtros atuais.
            </p>
          ) : (
            <div>
              <p>Antes de enviar a equipe, o atendimento liga para confirmar o endereço.</p>
              {urgentes.map((solicitacao, indice) => <TentativasDeContato key={indice} numero={solicitacao.numero} />)}
            </div>
          )}
        </Cartao>
      </main>

      <Rodape />
    </>
  );
}

export default App;
