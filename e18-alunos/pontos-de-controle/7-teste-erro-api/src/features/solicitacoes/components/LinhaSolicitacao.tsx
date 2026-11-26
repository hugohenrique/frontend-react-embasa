import { Link } from "react-router";
import { formatarData } from "../../../shared/datas";
import { nomesPrioridades, nomesTipos } from "../nomes";
import type { Solicitacao } from "../tipos";
import { SeloStatus } from "./SeloStatus";

type LinhaSolicitacaoProps = {
  solicitacao: Solicitacao;
  estaSelecionada: boolean;
};

export function LinhaSolicitacao({ solicitacao, estaSelecionada }: LinhaSolicitacaoProps) {
  return (
    <tr className={estaSelecionada ? "selecionada" : undefined}>
      <td>{solicitacao.numero}</td>
      <td>{nomesTipos[solicitacao.tipo]}</td>
      <td>{solicitacao.municipio}</td>
      <td>{solicitacao.bairro}</td>
      <td>{nomesPrioridades[solicitacao.prioridade]}</td>
      <td><time dateTime={solicitacao.abertura}>{formatarData(solicitacao.abertura)}</time></td>
      <td><SeloStatus status={solicitacao.status} /></td>
      <td>
        {/* Abrir agora é um link: muda o endereço, e a página lê o número de lá */}
        <Link
          to={`/solicitacoes/${solicitacao.numero}`}
          className="botao-linha"
          aria-current={estaSelecionada ? "page" : undefined}
        >
          Abrir<span className="sr-only"> a solicitação {solicitacao.numero}</span>
        </Link>
      </td>
    </tr>
  );
}
