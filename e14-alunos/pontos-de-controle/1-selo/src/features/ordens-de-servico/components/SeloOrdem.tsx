import { nomesDosStatusDaOrdem } from "../nomes";
import type { StatusOrdem } from "../tipos";

type SeloOrdemProps = {
  status: StatusOrdem;
};

// Mesmo padrão do SeloStatus de solicitações: a cor vem do CSS
export function SeloOrdem({ status }: SeloOrdemProps) {
  return <span className={`selo selo-ordem-${status}`}>{nomesDosStatusDaOrdem[status]}</span>;
}
