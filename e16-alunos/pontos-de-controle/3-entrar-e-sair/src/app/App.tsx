import { Navigate, Route, Routes } from "react-router";
import { PaginaOrdens } from "../features/ordens-de-servico";
import { PaginaSolicitacoes } from "../features/solicitacoes";
import { ProvedorDeSessao } from "../shared/sessao/ProvedorDeSessao";
import { Layout } from "./Layout";
import { PaginaEntrar } from "./PaginaEntrar";
import { PaginaNaoEncontrada } from "./PaginaNaoEncontrada";

// Cada endereço, uma tela. O Layout desenha o que é comum a todas.
// O ProvedorDeSessao fica em volta de todas as rotas, inclusive da tela de entrar.
function App() {
  return (
    <ProvedorDeSessao>
      <Routes>
        <Route path="entrar" element={<PaginaEntrar />} />
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/solicitacoes" replace />} />
          {/* O ? deixa o número opcional: /solicitacoes e /solicitacoes/26-08815 abrem a mesma tela */}
          <Route path="solicitacoes/:numero?" element={<PaginaSolicitacoes />} />
          <Route path="ordens" element={<PaginaOrdens />} />
          <Route path="*" element={<PaginaNaoEncontrada />} />
        </Route>
      </Routes>
    </ProvedorDeSessao>
  );
}

export default App;
