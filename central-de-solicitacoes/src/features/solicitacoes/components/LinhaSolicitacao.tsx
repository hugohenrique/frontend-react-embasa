import { Link } from "react-router";
import { formatarData } from "../../../shared/datas";
import { nomesDasPrioridades, nomesDosTipos } from "../nomes";
import type { Solicitacao } from "../tipos";
import { SeloStatus } from "./SeloStatus";

type LinhaSolicitacaoProps = {
  solicitacao: Solicitacao;
  selecionada: boolean;
};

export function LinhaSolicitacao({ solicitacao, selecionada }: LinhaSolicitacaoProps) {
  return (
    <tr className={selecionada ? "selecionada" : undefined}>
      <td>{solicitacao.numero}</td>
      <td>{nomesDosTipos[solicitacao.tipo]}</td>
      <td>{solicitacao.municipio}</td>
      <td>{solicitacao.bairro}</td>
      <td>{nomesDasPrioridades[solicitacao.prioridade]}</td>
      <td><time dateTime={solicitacao.abertura}>{formatarData(solicitacao.abertura)}</time></td>
      <td><SeloStatus status={solicitacao.status} /></td>
      <td>
        <Link
          to={`/solicitacoes/${solicitacao.numero}`}
          className="botao-linha"
          aria-current={selecionada ? "page" : undefined}
        >
          Abrir<span className="sr-only"> a solicitação {solicitacao.numero}</span>
        </Link>
      </td>
    </tr>
  );
}
