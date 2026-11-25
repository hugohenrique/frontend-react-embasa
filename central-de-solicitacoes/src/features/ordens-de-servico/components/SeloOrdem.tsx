import { Selo } from "../../../shared/ui/Selo";
import { nomesDosStatusDaOrdem, tonsDaOrdem } from "../nomes";
import type { StatusOrdem } from "../tipos";

type SeloOrdemProps = {
  status: StatusOrdem;
};

// O mesmo Selo de shared, com o tom e o texto da ordem
export function SeloOrdem({ status }: SeloOrdemProps) {
  return <Selo tom={tonsDaOrdem[status]}>{nomesDosStatusDaOrdem[status]}</Selo>;
}
