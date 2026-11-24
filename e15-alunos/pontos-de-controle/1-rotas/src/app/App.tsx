import { Navigate, Route, Routes } from "react-router";
import { PaginaOrdens } from "../features/ordens-de-servico";
import { PaginaSolicitacoes } from "../features/solicitacoes";
import { Layout } from "./Layout";

// Cada endereço, uma tela. O Layout desenha o que é comum a todas.
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/solicitacoes" replace />} />
        <Route path="solicitacoes" element={<PaginaSolicitacoes />} />
        <Route path="ordens" element={<PaginaOrdens />} />
      </Route>
    </Routes>
  );
}

export default App;
