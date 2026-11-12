import { PaginaSolicitacoes } from "../features/solicitacoes";
import { Cabecalho } from "../shared/ui/Cabecalho";
import { Rodape } from "../shared/ui/Rodape";

// O App só monta o esqueleto: cabeçalho, conteúdo e rodapé
function App() {
  return (
    <>
      <a href="#conteudo" className="pular-conteudo">Pular para o conteúdo</a>
      <Cabecalho />
      <main id="conteudo" className="pagina">
        <PaginaSolicitacoes />
      </main>
      <Rodape />
    </>
  );
}

export default App;
