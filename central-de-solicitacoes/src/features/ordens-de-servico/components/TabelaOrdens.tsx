import { formatarData } from "../../../shared/datas";
import type { OrdemDeServico } from "../tipos";
import { SeloOrdem } from "./SeloOrdem";

type TabelaOrdensProps = {
  ordens: OrdemDeServico[];
  total: number;
  selecionada: string | null;
  aoSelecionar: (numero: string) => void;
};

// Só apresenta: recebe a página pronta e desenha
export function TabelaOrdens({ ordens, total, selecionada, aoSelecionar }: TabelaOrdensProps) {
  if (ordens.length === 0) {
    return <p className="vazio" role="status">Nenhuma ordem com esse status.</p>;
  }

  return (
    <div className="tabela-rolagem" tabIndex={0} role="region" aria-label="Ordens de serviço">
      <table>
        <caption>Exibindo {ordens.length} de {total} ordens. Dados fictícios.</caption>
        <thead>
          <tr>
            <th scope="col">Ordem</th>
            <th scope="col">Solicitação</th>
            <th scope="col">Local</th>
            <th scope="col">Equipe</th>
            <th scope="col">Previsão</th>
            <th scope="col">Status</th>
            <th>
              <span className="sr-only">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {ordens.map((ordem) => (
            <tr key={ordem.numero} className={ordem.numero === selecionada ? "selecionada" : undefined}>
              <td>{ordem.numero}</td>
              <td>{ordem.solicitacao}</td>
              <td>{ordem.bairro}, {ordem.municipio}</td>
              <td>{ordem.nomeEquipe}</td>
              <td><time dateTime={ordem.previsao}>{formatarData(ordem.previsao)}</time></td>
              <td><SeloOrdem status={ordem.status} /></td>
              <td>
                <button
                  className="botao-linha"
                  type="button"
                  aria-pressed={ordem.numero === selecionada}
                  onClick={() => aoSelecionar(ordem.numero)}>
                  Atualizar<span className="sr-only"> a ordem {ordem.numero}</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
