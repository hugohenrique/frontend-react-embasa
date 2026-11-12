import { formatarData } from "../../../shared/datas";
import { nomesDasPrioridades, nomesDosTipos } from "../nomes";
import type { Solicitacao } from "../tipos";

type LinhaSolicitacaoProps = {
  solicitacao: Solicitacao;
};

export function LinhaSolicitacao({ solicitacao }: LinhaSolicitacaoProps) {
  return (
    <tr>
      <td>{solicitacao.numero}</td>
      <td>{nomesDosTipos[solicitacao.tipo]}</td>
      <td>{solicitacao.municipio}</td>
      <td>{solicitacao.bairro}</td>
      <td>{nomesDasPrioridades[solicitacao.prioridade]}</td>
      <td><time dateTime={solicitacao.abertura}>{formatarData(solicitacao.abertura)}</time></td>
    </tr>
  );
}
