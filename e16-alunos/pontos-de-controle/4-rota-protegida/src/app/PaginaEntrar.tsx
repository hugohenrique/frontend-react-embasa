import { useNavigate } from "react-router";
import { useSessao } from "../shared/sessao/SessaoContext";
import type { Usuario } from "../shared/sessao/SessaoContext";

// Login de demonstração: dois usuários fictícios. O login de verdade depende do sistema da Embasa.
const ATENDENTE: Usuario = { nome: "Ana Souza", perfil: "atendente" };
const SUPERVISOR: Usuario = { nome: "Carlos Lima", perfil: "supervisor" };

export function PaginaEntrar() {
  const { entrar } = useSessao();
  const navigate = useNavigate();

  // Entrou: o código decide ir para a lista (useNavigate, como depois de registrar)
  function entrarComo(usuario: Usuario) {
    entrar(usuario);
    navigate("/solicitacoes");
  }

  return (
    <main className="entrar">
      <h1>Central de Solicitações</h1>
      <p>Login de demonstração: escolha com quem entrar.</p>
      <button type="button" onClick={() => entrarComo(ATENDENTE)}>
        Entrar como Ana Souza, atendente
      </button>
      <button type="button" className="botao-secundario" onClick={() => entrarComo(SUPERVISOR)}>
        Entrar como Carlos Lima, supervisor
      </button>
    </main>
  );
}
