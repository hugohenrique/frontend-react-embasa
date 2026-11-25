import { Navigate, Route, Routes } from "react-router";
import Layout from "./Layout";
import { PaginaSolicitacoes } from "../features/solicitacoes";
import { PaginaOrdens } from "../features/ordens-de-servico";
import { PaginaNaoEncontrada } from "./PaginaNaoEncontrada";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* vai redirecionar para a pagina de solicitacoes */}
        <Route index element={<Navigate to="/solicitacoes" replace />} />
        <Route path="*" element={<PaginaNaoEncontrada />} />
        <Route path="/solicitacoes" element={<PaginaSolicitacoes />} />
        <Route path="/solicitacoes/:numero?" element={<PaginaSolicitacoes />} />
        <Route path="/ordens" element={<PaginaOrdens/>} />
      </Route>
    </Routes>
  );
}

export default App;
