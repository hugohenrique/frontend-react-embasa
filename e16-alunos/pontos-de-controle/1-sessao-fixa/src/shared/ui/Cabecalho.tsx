import { useContext } from "react";
import { SessaoContext, nomesDosPerfis } from "../sessao/SessaoContext";

export function Cabecalho() {
  // Lê quem está logado direto do Context, sem receber nada por Props
  const usuario = useContext(SessaoContext);

  return (
    <header className="topo">
      <p className="marca">Central de Solicitações</p>
      {usuario && (
        <p className="sessao">{usuario.nome} · {nomesDosPerfis[usuario.perfil]}</p>
      )}
    </header>
  );
}
