import { useState } from "react";
import { Cabecalho } from "./components/Cabecalho";
import { Cartao } from "./components/Cartao";
import { DicasAtendimento } from "./components/DicasAtendimento";
import { LinhaSolicitacao } from "./components/LinhaSolicitacao";
import { Rodape } from "./components/Rodape";
import { TentativasDeContato } from "./components/TentativasDeContato";
import { solicitacoes } from "./dados";
import { nomesDasPrioridades } from "./formatos";
import type { Prioridade } from "./tipos";

type FiltroPrioridade = Prioridade | "todas";

function App() {
  const [filtro, setFiltro] = useState<FiltroPrioridade>("todas");

  // Uma linha aparece se o filtro é "todas" ou se é a prioridade dela
  function deveMostrar(prioridade: Prioridade) {
    return filtro === "todas" || filtro === prioridade;
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
          <p className="total" aria-live="polite">
            {filtro === "todas" ? "Mostrando todas as prioridades." : `Mostrando só a prioridade ${nomesDasPrioridades[filtro]}.`}
          </p>

          {/* tabIndex={0} permite rolar a tabela pelo teclado */}
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
                {solicitacoes.map((solicitacao) =>
                  deveMostrar(solicitacao.prioridade) && (
                    <LinhaSolicitacao key={solicitacao.numero} solicitacao={solicitacao} />
                  )
                )}
              </tbody>
            </table>
          </div>
        </Cartao>

        <Cartao titulo="Retorno ao cliente">
          <p>Antes de enviar a equipe, o atendimento liga para confirmar o endereço.</p>
          <TentativasDeContato numero="26-08817" />
          <TentativasDeContato numero="26-08816" />
        </Cartao>
      </main>

      <Rodape />
    </>
  );
}

export default App;
