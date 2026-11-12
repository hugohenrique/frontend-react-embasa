import { nomesDosTipos } from "../formatos";
import type { Solicitacao, TipoServico } from "../tipos";

const tipos: TipoServico[] = ["vazamento", "falta-agua", "religacao"];

type ResumoPorTipoProps = {
  solicitacoes: Solicitacao[]
};

export default function ResumoPorTipo({ solicitacoes }: ResumoPorTipoProps) {
  return (
    <ul className="resumo">
      {tipos.map((tipo) => (
        <li key={tipo}>
          <strong>{solicitacoes.filter((solicitacao) => solicitacao.tipo === tipo).length}</strong>
          {nomesDosTipos[tipo]}
        </li>
      ))}
    </ul>
  );
};
