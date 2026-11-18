import { formatarData } from "../../../shared/datas";
import { nomesDasPrioridades, nomesDosTipos } from "../nomes";
import type { Solicitacao } from "../tipos";
import { SeloStatus } from "./SeloStatus";

type LinhaSolicitacaoProps = {
  solicitacao: Solicitacao;
  selecionada: boolean;
  aoAbrir: (numero: string) => void;
};

export function LinhaSolicitacao({ solicitacao, selecionada, aoAbrir }: LinhaSolicitacaoProps) {
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
        <button
          type="button"
          className="botao-linha"
          aria-pressed={selecionada}
          onClick={() => aoAbrir(solicitacao.numero)}
        >
          Abrir<span className="sr-only"> a solicitação {solicitacao.numero}</span>
        </button>
      </td>
    </tr>
  );
}
