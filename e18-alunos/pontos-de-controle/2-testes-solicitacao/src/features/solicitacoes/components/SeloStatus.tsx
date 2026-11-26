import { Selo } from "../../../shared/ui/Selo";
import { nomesDosStatus, tonsDosStatus } from "../nomes";
import type { Status } from "../tipos";

type SeloStatusProps = {
  status: Status;
};

// A solicitação escolhe o tom e o texto; quem desenha é o Selo, de shared
export function SeloStatus({ status }: SeloStatusProps) {
  return <Selo tom={tonsDosStatus[status]}>{nomesDosStatus[status]}</Selo>;
}
