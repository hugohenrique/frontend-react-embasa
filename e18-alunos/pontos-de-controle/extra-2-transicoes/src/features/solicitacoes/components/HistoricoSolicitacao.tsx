import { formatarDataHora } from "../../../shared/datas";
import { nomesStatus } from "../nomes";
import type { EventoHistorico } from "../tipos";

type HistoricoSolicitacaoProps = {
  eventos: EventoHistorico[];
};

// A linha do tempo da solicitação: cada mudança de status, da mais antiga para a mais nova
export function HistoricoSolicitacao({ eventos }: HistoricoSolicitacaoProps) {
  return (
    <ol className="historico">
      {eventos.map((evento) => (
        <li key={evento.em + evento.para} className={`historico-${evento.para}`}>
          <b>{evento.de === null ? "Registrada" : nomesStatus[evento.para]}</b>
          <time dateTime={evento.em}>{formatarDataHora(evento.em)}</time>
          {evento.observacao && <p>{evento.observacao}</p>}
        </li>
      ))}
    </ol>
  );
}
