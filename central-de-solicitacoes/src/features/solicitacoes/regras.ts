import type { NovaSolicitacao, Prioridade, Solicitacao } from "./tipos";

export type FiltroPrioridade = Prioridade | "todas";

export type Filtros = {
  prioridade: FiltroPrioridade,
  busca: string
};

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

export function ehUrgente(solicitacao: Solicitacao) {
  return solicitacao.prioridade === "alta";
}

export function proximoNumero(lista: Solicitacao[]): string {
  if (lista.length === 0) {
    return "26-00001";
  }

  const numeros = lista.map((solicitacao) => Number(solicitacao.numero.slice(3)));
  const maior = Math.max(...numeros);

  return `26-${String(maior + 1).padStart(5, "0")}`;
}

// A solicitacao nova, completa: com numero e data de abertura
export function completarSolicitacao(
  nova: NovaSolicitacao,
  lista: Solicitacao[],
  hoje: string
): Solicitacao {
  return {
    ...nova,
    numero: proximoNumero(lista),
    abertura: hoje
  };
}
