import { useEffect, useState } from "react";
import { Cabecalho } from "./components/Cabecalho";
import { Cartao } from "./components/Cartao";
import { DicasAtendimento } from "./components/DicasAtendimento";
import { LinhaSolicitacao } from "./components/LinhaSolicitacao";
import { Rodape } from "./components/Rodape";
import { TentativasDeContato } from "./components/TentativasDeContato";
import { solicitacoes } from "./dados";
import { hojeISO, nomesDasPrioridades } from "./formatos";
import type { NovaSolicitacao, Prioridade } from "./tipos";
import FormularioSolicitacao from "./components/FormularioSolicitacao";
import type { Solicitacao } from "./tipos";

type FiltroPrioridade = Prioridade | "todas";

function App() {
  const [lista, setLista] = useState<Solicitacao[]>(solicitacoes);
  const [filtro, setFiltro] = useState<FiltroPrioridade>("todas");
  const [busca, setBusca] = useState("");
  const [mensagem, setMensagem] = useState("");

  const termo = busca.trim().toLowerCase();

  // Só as solicitações que combinam com a prioridade e com o bairro buscado
  const visiveis = lista.filter(
    (solicitacao) =>
      (filtro === "todas" || solicitacao.prioridade === filtro) &&
      solicitacao.bairro.toLowerCase().includes(termo)
  );

  // Das que estão visíveis, as de prioridade alta: o retorno acompanha os filtros
  const urgentes = visiveis.filter(
    (solicitacao) => solicitacao.prioridade === "alta"
  );

  const totalUrgentes = lista.filter((solicitacao) => solicitacao.prioridade === "alta").length;

  useEffect(() => {
    document.title = `(${totalUrgentes}) Central de Solicitações`;
  }, [totalUrgentes]);

  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        setFiltro("todas");
        setBusca("");
      }
    }
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, []);

  function limparFiltros() {
    setFiltro("todas");
    setBusca("");
  }

  function registrar(nova: NovaSolicitacao) {
    const maior = Math.max(
      ...lista.map((solicitacao) => Number(solicitacao.numero.slice(3)))
    );

    const numero = `26-${String(maior + 1).padStart(5, "0")}`;

    setLista([{ ...nova, numero, abertura: hojeISO() }, ...lista]);
  }

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

        <Cartao titulo="Formulário de cadastro">
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
