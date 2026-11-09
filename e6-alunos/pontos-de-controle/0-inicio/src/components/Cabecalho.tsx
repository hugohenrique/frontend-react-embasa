export function Cabecalho() {
  return (
    <header className="topo">
      <p className="marca">Central de Solicitações</p>
      <nav aria-label="Principal">
        <ul className="menu">
          <li><a href="#inicio">Início</a></li>
          <li><a href="#nova">Nova solicitação</a></li>
          <li><a href="#recentes" aria-current="page">Solicitações</a></li>
        </ul>
      </nav>
    </header>
  );
}
