// A camada de acesso à API de solicitações.
// Só este arquivo conhece o endereço e o formato das respostas da API.
import type { Filtros } from "./regras";
import type { NovaSolicitacao, Solicitacao, SolicitacaoDetalhada, Status } from "./tipos";

const ENDERECO = "/api/solicitacoes";

export const POR_PAGINA = 20;

export type PaginaDeSolicitacoes = {
  itens: Solicitacao[],
  total: number,
  pagina: number,
  porPagina: number
};

// Os erros por campo que a API devolve com o status 422
export type ErrosDosCampos = Record<string, string>;

// O resultado de um registro: ou registrou, ou a API recusou e disse por quê
export type ResultadoRegistro =
  | { tipo: "registrada"; solicitacao: Solicitacao }
  | { tipo: "recusada"; campos: ErrosDosCampos };

export type ResultadoMudanca =
  | { tipo: "alterada", solicitacao: SolicitacaoDetalhada }
  | { tipo: "recusada", campos: ErrosDosCampos }
  | { tipo: "conflito", mensagem: string };

export type Consulta = Filtros & {
  pagina: number;
};

// Busca a lista de solicitações. Se a API responder com erro, lança um Error.
export async function listarSolicitacoes(consulta: Consulta): Promise<PaginaDeSolicitacoes> {
  // Monta o fim do endereço: ?pagina=1&porPagina=20&prioridade=alta&busca=Pituba
  const params = new URLSearchParams();
  params.set("pagina", String(consulta.pagina));
  params.set("porPagina", String(POR_PAGINA));

  if (consulta.prioridade !== "todas") {
    params.set("prioridade", consulta.prioridade);
  }

  if (consulta.busca.trim() !== "") {
    params.set("busca", consulta.busca);
  }

  const resposta = await fetch(`${ENDERECO}?${params}`);

  if (!resposta.ok) {
    throw new Error(`A API respondeu ${resposta.status} ao listar as solicitações.`);
  }

  return (await resposta.json()) as PaginaDeSolicitacoes;
}

// Envia uma solicitação nova. 422 não é falha: é a API dizendo o que corrigir.
export async function registrarSolicitacao(nova: NovaSolicitacao): Promise<ResultadoRegistro> {
  const resposta = await fetch(ENDERECO, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nova),
  });
  if (resposta.status === 422) {
    const corpo = (await resposta.json()) as { campos: ErrosDosCampos };
    return { tipo: "recusada", campos: corpo.campos };
  }
  if (!resposta.ok) {
    throw new Error(`A API respondeu ${resposta.status} ao registrar a solicitação.`);
  }
  const solicitacao = (await resposta.json()) as Solicitacao;
  return { tipo: "registrada", solicitacao };
}

// Busca uma solicitação com o histórico
export async function buscarSolicitacao(numero: string): Promise<SolicitacaoDetalhada> {
  const resposta = await fetch(`${ENDERECO}/${encodeURIComponent(numero)}`);
  if (!resposta.ok) {
    throw new Error(`A API respondeu ${resposta.status} ao buscar a solicitação ${numero}.`);
  }
  return (await resposta.json()) as SolicitacaoDetalhada;
}

export async function mudarStatus(
  numero: string,
  status: Status,
  observacao: string
): Promise<ResultadoMudanca> {
  const resposta = await fetch(
    `${ENDERECO}/${encodeURIComponent(numero)}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, observacao }),
    }
  );
  if (resposta.status === 422) {
    const corpo = (await resposta.json()) as { campos: ErrosDosCampos };
    return { tipo: "recusada", campos: corpo.campos };
  }
  if (resposta.status === 409) {
    const corpo = (await resposta.json()) as { mensagem: string };
    return { tipo: "conflito", mensagem: corpo.mensagem };
  }
  const solicitacao = (await resposta.json()) as SolicitacaoDetalhada;
  return {
    tipo: "alterada",
    solicitacao
  };
}
