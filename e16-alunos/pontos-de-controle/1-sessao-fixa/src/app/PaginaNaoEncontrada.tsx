import { Link } from "react-router";

// Qualquer endereço que nenhuma rota conhece cai aqui (path="*")
export function PaginaNaoEncontrada() {
  return (
    <>
      <h1>Página não encontrada</h1>
      <p>O endereço digitado não existe na Central.</p>
      <p><Link to="/solicitacoes">Voltar para as solicitações</Link></p>
    </>
  );
}
