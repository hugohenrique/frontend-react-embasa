// ENCONTRO 5, PONTO DE PARTIDA
// O return abaixo é o HTML da página da etapa 1, colado como estava.
// Ainda não é JSX válido: no exercício 1, vamos corrigir juntos.

import LinhaSolicitacao from './components/LinhaSolicitacao';

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

          <section className="cartao">
            <h2>Solicitações recentes</h2>
            {/* <!-- tabindex="0" permite rolar a tabela pelo teclado -->*/}
            <div className="tabela-rolagem" tabIndex={0} role="region" aria-label="Solicitações recentes">
              <table>
                <caption>Últimas solicitações abertas. Dados fictícios.</caption>
                <thead>
                  <tr>
                    <th scope="col">Nº</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Município</th>
                    <th scope="col">Prioridade</th>
                    <th scope="col">Abertura</th>
                  </tr>
                </thead>
                <tbody>
                  <LinhaSolicitacao
                    numero="26-08817"
                    tipo="vazamento"
                    municipio="Salvador"
                    prioridade="alta"
                    abertura="2026-11-09"
                  />
                  <LinhaSolicitacao
                    numero="26-08816"
                    tipo="falta-agua"
                    municipio="Feira de Santana"
                    prioridade="alta"
                    abertura="2026-11-09"
                  />
                  {/*
                  <tr><td>26-08817</td><td>Vazamento</td><td>Salvador</td><td>Alta</td><td>09/11/2026</td></tr>
                  <tr><td>26-08816</td><td>Falta d'água</td><td>Feira de Santana</td><td>Alta</td><td>09/11/2026</td></tr>
                  <tr><td>26-08815</td><td>Religação</td><td>Camaçari</td><td>Média</td><td>06/11/2026</td></tr>
                  <tr><td>26-08814</td><td>Vazamento</td><td>Vitória da Conquista</td><td>Baixa</td><td>06/11/2026</td></tr>
                  */}
                </tbody>
              </table>
            </div>
          </section>
        </main>

        <footer className="rodape">
          <p>Central de Solicitações · projeto do curso Desenvolvimento Front-end com React · dados fictícios</p>
        </footer>
      </>
  );
}

export default App;
