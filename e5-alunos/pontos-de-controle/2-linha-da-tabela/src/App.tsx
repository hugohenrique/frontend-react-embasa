import { Cabecalho } from "./components/Cabecalho";
import { LinhaSolicitacao } from "./components/LinhaSolicitacao";
import { Rodape } from "./components/Rodape";

function App() {
  return (
    <>
      <a href="#conteudo" className="pular-conteudo">Pular para o conteúdo</a>
      <Cabecalho />

      <main id="conteudo" className="pagina">
        <h1>Solicitações de serviço</h1>
        <p>Pedidos registrados pelo atendimento: vazamentos, falta d'água e religações.</p>

        <section className="cartao">
          <h2>Solicitações recentes</h2>
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
                <LinhaSolicitacao numero="26-08817" tipo="vazamento" municipio="Salvador" bairro="Itapuã" prioridade="alta" abertura="2026-11-09" />
                <LinhaSolicitacao numero="26-08816" tipo="falta-agua" municipio="Feira de Santana" bairro="Centro" prioridade="alta" abertura="2026-11-09" />
                <LinhaSolicitacao numero="26-08815" tipo="religacao" municipio="Camaçari" bairro="Gleba A" prioridade="media" abertura="2026-11-06" />
                <LinhaSolicitacao numero="26-08814" tipo="vazamento" municipio="Vitória da Conquista" bairro="Candeias" prioridade="baixa" abertura="2026-11-06" />
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Rodape />
    </>
  );
}

export default App;
