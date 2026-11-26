import { NavLink, Outlet } from "react-router";
import { ProvedorAvisos } from "../shared/avisos/ProvedorAvisos";
import { Cabecalho } from "../shared/ui/Cabecalho";
import { Rodape } from "../shared/ui/Rodape";

// O que aparece em toda tela. O Outlet é o lugar onde entra a tela do endereço atual.
export function Layout() {
  // O provedor fica em volta de tudo: qualquer tela dentro dele pode mostrar um aviso
  return (
    <ProvedorAvisos>
      <a href="#conteudo" className="pular-conteudo">Pular para o conteúdo</a>
      <Cabecalho />
      <nav className="areas" aria-label="Áreas da Central">
        <NavLink to="/solicitacoes">Solicitações</NavLink>
        <NavLink to="/ordens">Ordens de serviço</NavLink>
      </nav>
      <main id="conteudo" className="pagina">
        <Outlet />
      </main>
      <Rodape />
    </ProvedorAvisos>
  );
}
