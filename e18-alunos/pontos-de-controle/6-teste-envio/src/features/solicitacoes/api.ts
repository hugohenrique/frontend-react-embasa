// A camada de acesso à API de solicitações.
// Só este arquivo conhece o endereço e o formato das respostas da API.
import type { Filtros } from "./regras";
import type { NovaSolicitacao, Solicitacao, SolicitacaoDetalhada, Status } from "./tipos";

const ENDERECO = "/api/solicitacoes";

// Quantas solicitações vêm em cada página
export const POR_PAGINA = 20;

// O que a tela pede à API: os filtros e a página
export type Consulta = Filtros & {
  pagina: number;
};

// Uma página da lista, como a API devolve
export type SolicitacoesPaginadas = {
  itens: Solicitacao[];
  total: number;
  pagina: number;
  porPagina: number;
};

// Os erros por campo que a API devolve com o status 422
export type ErrosCampos = Record<string, string>;

// O resultado de um registro: ou registrou, ou a API recusou e disse por quê
export type ResultadoRegistro =
  | { tipo: "registrada"; solicitacao: Solicitacao }
  | { tipo: "recusada"; campos: ErrosCampos };

// O resultado de uma mudança de status: mudou, a API recusou um campo,
// ou houve conflito (outra pessoa já mudou o status antes)
export type ResultadoMudanca =
  | { tipo: "alterada"; solicitacao: SolicitacaoDetalhada }
  | { tipo: "recusada"; campos: ErrosCampos }
  | { tipo: "conflito"; mensagem: string };

// Busca uma página da lista, já filtrada pela API. Se a API responder com erro, lança um Error.
export async function listarSolicitacoes(consulta: Consulta): Promise<SolicitacoesPaginadas> {
  // Monta o fim do endereço: ?pagina=1&porPagina=20&prioridade=alta&busca=Pituba
  const parametros = new URLSearchParams();
  parametros.set("pagina", String(consulta.pagina));
  parametros.set("porPagina", String(POR_PAGINA));
  if (consulta.prioridade !== "todas") parametros.set("prioridade", consulta.prioridade);
  if (consulta.busca.trim() !== "") parametros.set("busca", consulta.busca.trim());

  const resposta = await fetch(`${ENDERECO}?${parametros}`);
  if (!resposta.ok) {
    throw new Error(`A API respondeu ${resposta.status} ao listar as solicitações.`);
  }
  return (await resposta.json()) as SolicitacoesPaginadas;
}

// Envia uma solicitação nova. 422 não é falha: é a API dizendo o que corrigir.
export async function registrarSolicitacao(nova: NovaSolicitacao): Promise<ResultadoRegistro> {
  const resposta = await fetch(ENDERECO, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nova),
  });
  if (resposta.status === 422) {
    const corpo = (await resposta.json()) as { campos: ErrosCampos };
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

// Muda o status de uma solicitação. 422 e 409 são respostas, não falhas.
export async function mudarStatus(
  numero: string,
  status: Status,
  observacao: string
): Promise<ResultadoMudanca> {
  const resposta = await fetch(`${ENDERECO}/${encodeURIComponent(numero)}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, observacao }),
  });
  if (resposta.status === 422) {
    const corpo = (await resposta.json()) as { campos: ErrosCampos };
    return { tipo: "recusada", campos: corpo.campos };
  }
  if (resposta.status === 409) {
    const corpo = (await resposta.json()) as { mensagem: string };
    return { tipo: "conflito", mensagem: corpo.mensagem };
  }
  if (!resposta.ok) {
    throw new Error(`A API respondeu ${resposta.status} ao mudar o status de ${numero}.`);
  }
  const solicitacao = (await resposta.json()) as SolicitacaoDetalhada;
  return { tipo: "alterada", solicitacao };
}
