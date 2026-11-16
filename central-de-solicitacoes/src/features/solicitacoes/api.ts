import type { Solicitacao } from './tipos';

const ENDERECO = '/api/solicitacoes';

type RespostaLista = {
  itens: Solicitacao[],
  total: number
};

export async function listarSolicitacoes(): Promise<Solicitacao[]> {
  const resposta = await fetch(ENDERECO);
  if (!resposta.ok) {
    throw new Error(`A API respondeu ${resposta.status} ao listar as solicitações.`);
  }

  const corpo = (await resposta.json()) as RespostaLista;
  return corpo.itens;
  // JSON.parte: do texto para objeto
  // JSON.stringify() do objeto para texto
}
