import { formatarDataHora } from "../../../shared/datas";
import { nomesDosStatus } from "../nomes";
import type { EventoHistorico } from "../tipos";

type HistoricoSolicitacaoProps = {
  eventos: EventoHistorico[];
};

export function HistoricoSolicitacao({ eventos }: HistoricoSolicitacaoProps) {
  return (
    <ol className="historico">
      {eventos.map((evento) => (
        <li key={evento.em + evento.para} className={`historico-${evento.para}`}>
          <b>{evento.de === null ? "Registrada" : nomesDosStatus[evento.para]}</b>
          <time dateTime={evento.em}>{formatarDataHora(evento.em)}</time>
          {evento.observacao && <p>{evento.observacao}</p>}
        </li>
      ))}
    </ol>
  );
}
