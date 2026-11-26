import { Selo } from "../../../shared/ui/Selo";
import { nomesStatusOrdem, tonsOrdem } from "../nomes";
import type { StatusOrdem } from "../tipos";

type SeloOrdemProps = {
  status: StatusOrdem;
};

// O mesmo Selo de shared, com o tom e o texto da ordem
export function SeloOrdem({ status }: SeloOrdemProps) {
  return <Selo tom={tonsOrdem[status]}>{nomesStatusOrdem[status]}</Selo>;
}
