import { nomesDosStatus } from "../nomes";
import type { Status } from "../tipos";

type SeloStatusProps = {
  status: Status
};

export default function SeloStatus({ status }: SeloStatusProps) {
  return (
    <span className={`selo selo-${status}`}>{nomesDosStatus[status]}</span>
  );
}
