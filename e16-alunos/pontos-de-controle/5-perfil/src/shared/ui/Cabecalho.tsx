import { useNavigate } from "react-router";
import { nomesDosPerfis, useSessao } from "../sessao/SessaoContext";

export function Cabecalho() {
  // Lê quem está logado direto do Context, sem receber nada por Props
  const { usuario, sair } = useSessao();
  const navigate = useNavigate();

  function sairDaCentral() {
    sair();
    navigate("/entrar");
  }

  return (
    <header className="topo">
      <p className="marca">Central de Solicitações</p>
      {usuario && (
        <p className="sessao">
          {usuario.nome} · {nomesDosPerfis[usuario.perfil]}
          <button type="button" className="botao-linha" onClick={sairDaCentral}>Sair</button>
        </p>
      )}
    </header>
  );
}
