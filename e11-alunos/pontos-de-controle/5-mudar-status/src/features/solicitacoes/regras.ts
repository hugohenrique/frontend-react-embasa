// Regras de negócio da Central de Solicitações.
// Funções puras: recebem dados e devolvem dados. Não usam React e não mexem na tela.
import type { Prioridade, Solicitacao, Status } from "./tipos";

export type FiltroPrioridade = Prioridade | "todas";

export type Filtros = {
  prioridade: FiltroPrioridade;
  busca: string;
};

// As solicitações que combinam com a prioridade e com o bairro buscado
export function filtrarSolicitacoes(
  lista: Solicitacao[],
  filtros: Filtros
): Solicitacao[] {
  const termo = filtros.busca.trim().toLowerCase();
  return lista.filter(
    (solicitacao) =>
      (filtros.prioridade === "todas" || solicitacao.prioridade === filtros.prioridade) &&
      solicitacao.bairro.toLowerCase().includes(termo)
  );
}

// Urgente, na Central, é prioridade alta e ainda não resolvida
export function ehUrgente(solicitacao: Solicitacao): boolean {
  return (
    solicitacao.prioridade === "alta" &&
    (solicitacao.status === "aberta" || solicitacao.status === "em-atendimento")
  );
}

// Para onde cada status pode ir. É a mesma regra da API: a tela usa para mostrar
// só os botões possíveis, e a API confere de novo, porque é ela quem decide.
const TRANSICOES: Record<Status, Status[]> = {
  aberta: ["em-atendimento", "cancelada"],
  "em-atendimento": ["concluida", "cancelada"],
  concluida: [],
  cancelada: [],
};

export function proximosStatus(status: Status): Status[] {
  return TRANSICOES[status];
}
