import type { Solicitacao } from "../tipos";
import { LinhaSolicitacao } from "./LinhaSolicitacao";

type TabelaSolicitacoesProps = {
  solicitacoes: Solicitacao[];
  total: number;
  selecionada: string | null;
};

// Só apresenta: recebe a lista pronta e desenha. Não filtra, não guarda estado.
export function TabelaSolicitacoes({ solicitacoes, total, selecionada }: TabelaSolicitacoesProps) {
  if (solicitacoes.length === 0) {
    return (
      <p className="vazio" role="status">
        Nenhuma solicitação encontrada. Confira o bairro digitado ou escolha outra prioridade.
      </p>
    );
  }

  return (
    <div className="tabela-rolagem" tabIndex={0} role="region" aria-label="Solicitações recentes">
      <table>
        <caption>Exibindo {solicitacoes.length} de {total} solicitações. Dados fictícios.</caption>
        <thead>
          <tr>
            <th scope="col">Nº</th>
            <th scope="col">Tipo</th>
            <th scope="col">Município</th>
            <th scope="col">Bairro</th>
            <th scope="col">Prioridade</th>
            <th scope="col">Abertura</th>
            <th scope="col">Status</th>
            <th scope="col"><span className="sr-only">Ações</span></th>
          </tr>
        </thead>
        <tbody>
          {solicitacoes.map((solicitacao) => (
            <LinhaSolicitacao
              key={solicitacao.numero}
              solicitacao={solicitacao}
              estaSelecionada={solicitacao.numero === selecionada}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
