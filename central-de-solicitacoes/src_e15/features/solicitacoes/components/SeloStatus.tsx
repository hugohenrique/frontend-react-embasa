import Selo from "../../../shared/ui/Selo";
import { nomesDosStatus, tonsDosStatus } from "../nomes";
import type { Status } from "../tipos";

type SeloStatusProps = {
  status: Status;
};

export function SeloStatus({ status }: SeloStatusProps) {
  return <Selo tom={tonsDosStatus[status]}>{nomesDosStatus[status]}</Selo>;
}
