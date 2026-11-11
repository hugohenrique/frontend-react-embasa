import { useState } from 'react';
import type { Prioridade } from './tipos';
import { nomesDasPrioridades } from './formatos';
import { Cabecalho } from "./components/Cabecalho";
import Cartao from "./components/Cartao";
import { LinhaSolicitacao } from "./components/LinhaSolicitacao";
import { Rodape } from "./components/Rodape";
import TentativasDeContato from "./components/TentativasDeContato";

type FiltroPrioridade = Prioridade | "todas";

function App() {
  const [filtro, setFiltro] = useState<FiltroPrioridade>("todas");

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
          <p className="total">
            {filtro === "todas" ? "Mostrando todas as prioridades" : `Mostrando só a prioridade ${nomesDasPrioridades[filtro]}`}
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
                {deveMostrar("alta") && (
                  <LinhaSolicitacao numero="26-08817" tipo="vazamento" municipio="Salvador" bairro="Itapuã" prioridade="alta" abertura="2026-11-09" />
                )}
                {deveMostrar("alta") && (
                  <LinhaSolicitacao numero="26-08816" tipo="falta-agua" municipio="Feira de Santana" bairro="Centro" prioridade="alta" abertura="2026-11-09" />
                )}
                {deveMostrar("media") && (
                  <LinhaSolicitacao numero="26-08815" tipo="religacao" municipio="Camaçari" bairro="Gleba A" prioridade="media" abertura="2026-11-06" />
                )}
                {deveMostrar("baixa") && (
                  <LinhaSolicitacao numero="26-08814" tipo="vazamento" municipio="Vitória da Conquista" bairro="Candeias" prioridade="baixa" abertura="2026-11-06" />
                )}
              </tbody>
            </table>
          </div>
        </Cartao>
        <TentativasDeContato numero="26-08817" />
        <TentativasDeContato numero="26-08816" />
      </main>

      <Rodape />
    </>
  );
}

export default App;
