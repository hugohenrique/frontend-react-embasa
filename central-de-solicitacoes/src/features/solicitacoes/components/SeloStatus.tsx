import { nomesDosStatus } from "../nomes";
import type { Status } from "../tipos";

type SeloStatusProps = {
  status: Status;
};

// O status como um selo colorido. A cor vem do CSS: selo-aberta, selo-concluida...
export function SeloStatus({ status }: SeloStatusProps) {
  return <span className={`selo selo-${status}`}>{nomesDosStatus[status]}</span>;
}
