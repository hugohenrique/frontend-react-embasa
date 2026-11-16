// A camada de acesso à API de solicitações.
// Só este arquivo conhece o endereço e o formato das respostas da API.
import type { NovaSolicitacao, Solicitacao, SolicitacaoDetalhada } from "./tipos";

const ENDERECO = "/api/solicitacoes";

// O formato da resposta da lista, como a API devolve
type RespostaLista = {
  itens: Solicitacao[];
  total: number;
};

// Os erros por campo que a API devolve com o status 422
export type ErrosDosCampos = Record<string, string>;

// O resultado de um registro: ou registrou, ou a API recusou e disse por quê
export type ResultadoRegistro =
  | { tipo: "registrada"; solicitacao: Solicitacao }
  | { tipo: "recusada"; campos: ErrosDosCampos };

// Busca a lista de solicitações. Se a API responder com erro, lança um Error.
export async function listarSolicitacoes(): Promise<Solicitacao[]> {
  const resposta = await fetch(ENDERECO);
  if (!resposta.ok) {
    throw new Error(`A API respondeu ${resposta.status} ao listar as solicitações.`);
  }
  const corpo = (await resposta.json()) as RespostaLista;
  return corpo.itens;
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
