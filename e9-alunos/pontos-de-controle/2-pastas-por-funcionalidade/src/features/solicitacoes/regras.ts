// Regras de negócio da Central de Solicitações.
// Funções puras: recebem dados e devolvem dados. Não usam React e não mexem na tela.
import type { NovaSolicitacao, Prioridade, Solicitacao } from "./tipos";

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

// Urgente, na Central, é prioridade alta
export function ehUrgente(solicitacao: Solicitacao): boolean {
  return solicitacao.prioridade === "alta";
}

// O número seguinte ao maior da lista. Lista vazia: começa do 1.
export function proximoNumero(lista: Solicitacao[]): string {
  if (lista.length === 0) return "26-00001";
  const numeros = lista.map((solicitacao) => Number(solicitacao.numero.slice(3)));
  const maior = Math.max(...numeros);
  return `26-${String(maior + 1).padStart(5, "0")}`;
}

// A solicitação nova, completa: com número e data de abertura
export function completarSolicitacao(
  nova: NovaSolicitacao,
  lista: Solicitacao[],
  hoje: string
): Solicitacao {
  return { ...nova, numero: proximoNumero(lista), abertura: hoje };
}
