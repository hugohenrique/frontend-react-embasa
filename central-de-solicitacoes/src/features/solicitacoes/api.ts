// A camada de acesso à API de solicitações.
// Só este arquivo conhece o endereço e o formato das respostas da API.
import type { NovaSolicitacao, Solicitacao, SolicitacaoDetalhada } from "./tipos";

export type ErrosCampos = Record<string, string>;

const ENDERECO = "/api/solicitacoes";

// O formato da resposta da lista, como a API devolve
type RespostaLista = {
  itens: Solicitacao[];
  total: number;
};

export type ResultadoRegistro =
  | { tipo: "registrada"; solicitacao: Solicitacao }
  | { tipo: "recusada"; campos: ErrosCampos };

function apiError(status: number) {
  return new Error(`A API respondeu ${status} na solicitação.`);
}

// Busca a lista de solicitações. Se a API responder com erro, lança um Error.
export async function listarSolicitacoes(): Promise<Solicitacao[]> {
  const resposta = await fetch(ENDERECO);
  if (!resposta.ok) {
    throw apiError(resposta.status);
  }
  const corpo = (await resposta.json()) as RespostaLista;
  return corpo.itens;
}

export async function registrarSolicitacao(nova: NovaSolicitacao): Promise<ResultadoRegistro> {
  const resposta = await fetch(
    ENDERECO,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nova)
    }
  );
  if (resposta.status === 422) {
    const corpo = (await resposta.json()) as { campos: ErrosCampos };
    return {
      tipo: "recusada",
      campos: corpo.campos
    };
  }
  if (!resposta.ok) {
    throw apiError(resposta.status);
  }
  const solicitacao = (await resposta.json()) as Solicitacao;
  return {
    tipo: "registrada",
    solicitacao
  };
}

// api/solicitacoes/26-08822
export async function buscarSolicitacao(numero: string): Promise<SolicitacaoDetalhada> {
  const resposta = await fetch(`${ENDERECO}/${numero}`, { method: "GET" });
  if (!resposta.ok) {
    throw apiError(resposta.status);
  }
  return (await resposta.json()) as SolicitacaoDetalhada;
}
