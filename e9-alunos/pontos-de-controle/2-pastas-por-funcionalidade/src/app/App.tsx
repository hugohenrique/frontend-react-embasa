import { useEffect, useState } from "react";
import { DicasAtendimento, TentativasDeContato } from "../features/atendimento";
import { FormularioSolicitacao } from "../features/solicitacoes/components/FormularioSolicitacao";
import { LinhaSolicitacao } from "../features/solicitacoes/components/LinhaSolicitacao";
import { solicitacoes } from "../features/solicitacoes/dados";
import { nomesDasPrioridades } from "../features/solicitacoes/nomes";
import { completarSolicitacao, ehUrgente, filtrarSolicitacoes } from "../features/solicitacoes/regras";
import type { FiltroPrioridade } from "../features/solicitacoes/regras";
import type { NovaSolicitacao, Solicitacao } from "../features/solicitacoes/tipos";
import { hojeISO } from "../shared/datas";
import { Cabecalho } from "../shared/ui/Cabecalho";
import { Cartao } from "../shared/ui/Cartao";
import { Rodape } from "../shared/ui/Rodape";

function App() {
  const [lista, setLista] = useState<Solicitacao[]>(solicitacoes);
  const [mensagem, setMensagem] = useState("");
  const [filtro, setFiltro] = useState<FiltroPrioridade>("todas");
  const [busca, setBusca] = useState("");

  // A solicitação nova ganha número e data e entra no topo da lista
  function registrar(nova: NovaSolicitacao) {
    const completa = completarSolicitacao(nova, lista, hojeISO());
    setLista([completa, ...lista]);
    setMensagem(`Solicitação ${completa.numero} registrada.`);
  }

  function limparFiltros() {
    setFiltro("todas");
    setBusca("");
  }

  const visiveis = filtrarSolicitacoes(lista, { prioridade: filtro, busca });
  const urgentes = visiveis.filter(ehUrgente);
  const totalUrgentes = lista.filter(ehUrgente).length;

  // Efeito 1: mantém o título da aba do navegador em dia
  useEffect(() => {
    document.title = `(${totalUrgentes}) Central de Solicitações`;
  }, [totalUrgentes]);

  // Efeito 2: a tecla Esc limpa os filtros, de qualquer lugar da página
  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        console.log("Esc: limpando os filtros");
        setFiltro("todas");
        setBusca("");
      }
    }
    window.addEventListener("keydown", aoTeclar);
    // A limpeza: tira o ouvinte quando o componente sai da tela
    return () => window.removeEventListener("keydown", aoTeclar);
  }, []);

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

        <Cartao titulo="Nova solicitação">
          <FormularioSolicitacao aoRegistrar={registrar} />
          <p className="mensagem" role="status">{mensagem}</p>
        </Cartao>

        <Cartao titulo="Solicitações recentes">
          <div className="filtros">
            <div>
              <label htmlFor="filtro-prioridade">Prioridade</label>
              <select
                id="filtro-prioridade"
                value={filtro}
                onChange={(evento) => setFiltro(evento.target.value as FiltroPrioridade)}
              >
                <option value="todas">Todas</option>
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>
            <div>
              <label htmlFor="busca-bairro">Buscar por bairro</label>
              <input
                type="search"
                id="busca-bairro"
                value={busca}
                onChange={(evento) => setBusca(evento.target.value)}
              />
            </div>
          </div>
          <div className="acoes">
            <button type="button" className="botao-secundario" onClick={limparFiltros}>
              Limpar filtros
            </button>
          </div>
          <p className="total" aria-live="polite">
            {filtro === "todas" ? "Mostrando todas as prioridades." : `Mostrando só a prioridade ${nomesDasPrioridades[filtro]}.`}
          </p>

          {/* Sem resultado: uma mensagem no lugar da tabela */}
          {visiveis.length === 0 ? (
            <p className="vazio" role="status">
              Nenhuma solicitação encontrada. Confira o bairro digitado ou escolha outra prioridade.
            </p>
          ) : (
            <div className="tabela-rolagem" tabIndex={0} role="region" aria-label="Solicitações recentes">
              <table>
                <caption>Exibindo {visiveis.length} de {lista.length} solicitações. Dados fictícios.</caption>
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
        </Cartao>

        <Cartao titulo="Retorno ao cliente">
          <p>Antes de enviar a equipe, o atendimento liga para confirmar o endereço. Aparecem aqui as de prioridade alta que estão na tabela.</p>
          {urgentes.length === 0 ? (
            <p className="vazio" role="status">
              Nenhuma solicitação de prioridade alta com os filtros atuais.
            </p>
          ) : (
            urgentes.map((solicitacao) => (
              <TentativasDeContato
                key={solicitacao.numero}
                numero={solicitacao.numero}
              />
            ))
          )}
        </Cartao>
      </main>

      <Rodape />
    </>
  );
}

export default App;
