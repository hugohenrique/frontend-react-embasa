// ENCONTRO 5, PONTO DE PARTIDA
// O return abaixo é o HTML da página da etapa 1, colado como estava.
// Ainda não é JSX válido: no exercício 1, vamos corrigir juntos.

import LinhaSolicitacao from './components/LinhaSolicitacao';
import Cartao from './components/Cartao';

function App() {
  return (
    <>
        <a href="#conteudo" className="pular-conteudo">Pular para o conteúdo</a>
        <header className="topo">
          <p className="marca">Central de Solicitações</p>
          <nav aria-label="Principal">
            <ul className="menu">
              <li><a href="#inicio">Início</a></li>
              <li><a href="#nova">Nova solicitação</a></li>
              <li><a href="#recentes" aria-current="page">Solicitações</a></li>
            </ul>
          </nav>
        </header>

        <main id="conteudo" className="pagina">
          <h1>Solicitações de serviço</h1>
          <p>Pedidos registrados pelo atendimento: vazamentos, falta d'água e religações.</p>

          <Cartao titulo="Solicitações recentes">
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
                  <LinhaSolicitacao
                    numero="26-08817"
                    tipo="vazamento"
                    municipio="Salvador"
                    bairro="Cabula"
                    prioridade="alta"
                    abertura="2026-11-09"
                  />
                  <LinhaSolicitacao
                    numero="26-08816"
                    tipo="falta-agua"
                    municipio="Feira de Santana"
                    bairro="Candeal"
                    prioridade="alta"
                    abertura="2026-11-09"
                  />
                  <LinhaSolicitacao
                    numero="26-08815"
                    tipo="religacao"
                    municipio="Camaçari"
                    bairro="Arembepe"
                    prioridade="media"
                    abertura="2026-11-06"
                  />
                </tbody>
              </table>
            </div>
          </Cartao>
          <Cartao titulo="Solicitações mais antigas">
            <div className="tabela-rolagem" tabIndex={0} role="region" aria-label="Solicitações mais antigas">
              <table>
                <caption>Solicitações abertas há mais tempo. Dados fictícios.</caption>
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
                <tbody></tbody>
              </table>
            </div>
          </Cartao>
        </main>

        <footer className="rodape">
          <p>Central de Solicitações · projeto do curso Desenvolvimento Front-end com React · dados fictícios</p>
        </footer>
      </>
  );
}

export default App;
