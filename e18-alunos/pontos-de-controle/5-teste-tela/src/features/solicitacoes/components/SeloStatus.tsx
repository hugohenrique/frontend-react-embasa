import { Selo } from "../../../shared/ui/Selo";
import { nomesStatus, tonsStatus } from "../nomes";
import type { Status } from "../tipos";

type SeloStatusProps = {
  status: Status;
};

// A solicitação escolhe o tom e o texto; quem desenha é o Selo, de shared
export function SeloStatus({ status }: SeloStatusProps) {
  return <Selo tom={tonsStatus[status]}>{nomesStatus[status]}</Selo>;
}
