import { useState } from "react";
import { PaginaOrdens } from "../features/ordens-de-servico";
import { PaginaSolicitacoes } from "../features/solicitacoes";
import { Cabecalho } from "../shared/ui/Cabecalho";
import { Rodape } from "../shared/ui/Rodape";

type Area = "solicitacoes" | "ordens";

// O App monta o esqueleto e escolhe qual área aparece.
// No encontro 15, as rotas vão fazer este papel, com um endereço para cada área.
function App() {
  const [area, setArea] = useState<Area>("solicitacoes");

  return (
    <>
      <a href="#conteudo" className="pular-conteudo">Pular para o conteúdo</a>
      <Cabecalho />
      <nav className="areas" aria-label="Áreas da Central">
        <button type="button" aria-pressed={area === "solicitacoes"} onClick={() => setArea("solicitacoes")}>
          Solicitações
        </button>
        <button type="button" aria-pressed={area === "ordens"} onClick={() => setArea("ordens")}>
          Ordens de serviço
        </button>
      </nav>
      <main id="conteudo" className="pagina">
        {area === "solicitacoes" ? <PaginaSolicitacoes /> : <PaginaOrdens />}
      </main>
      <Rodape />
    </>
  );
}

export default App;
