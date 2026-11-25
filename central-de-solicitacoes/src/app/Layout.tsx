import { NavLink, Outlet } from "react-router";
import { Cabecalho } from "../shared/ui/Cabecalho";
import { Rodape } from "../shared/ui/Rodape";
import ProvedorDeAvisos from "../shared/avisos/ProvedorDeAvisos";

export default function Layout() {
  return (
    <>
      <ProvedorDeAvisos>
        <a href="#conteudo" className="pular-conteudo">Pular para o conteúdo</a>
        <Cabecalho />
        <nav className="areas" aria-label="Áreas da Central">
          <NavLink to="/solicitacoes">Solicitações</NavLink>
          <NavLink to="/ordens">Ordens de serviço</NavLink>
        </nav>
        <main id="conteudo" className="pagina">
          <Outlet/>
        </main>
        <Rodape />
      </ProvedorDeAvisos>
    </>
  );
}
