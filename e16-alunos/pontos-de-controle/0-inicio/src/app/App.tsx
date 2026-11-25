import { Navigate, Route, Routes } from "react-router";
import { PaginaOrdens } from "../features/ordens-de-servico";
import { PaginaSolicitacoes } from "../features/solicitacoes";
import { Layout } from "./Layout";
import { PaginaNaoEncontrada } from "./PaginaNaoEncontrada";

// Cada endereço, uma tela. O Layout desenha o que é comum a todas.
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/solicitacoes" replace />} />
        {/* O ? deixa o número opcional: /solicitacoes e /solicitacoes/26-08815 abrem a mesma tela */}
        <Route path="solicitacoes/:numero?" element={<PaginaSolicitacoes />} />
        <Route path="ordens" element={<PaginaOrdens />} />
        <Route path="*" element={<PaginaNaoEncontrada />} />
      </Route>
    </Routes>
  );
}

export default App;
