// A camada de acesso à API de solicitações.
// Só este arquivo conhece o endereço e o formato das respostas da API.
import type { Solicitacao } from "./tipos";

const ENDERECO = "/api/solicitacoes";

// O formato da resposta da lista, como a API devolve
type RespostaLista = {
  itens: Solicitacao[];
  total: number;
};

// Busca a lista de solicitações. Se a API responder com erro, lança um Error.
export async function listarSolicitacoes(): Promise<Solicitacao[]> {
  const resposta = await fetch(ENDERECO);
  if (!resposta.ok) {
    throw new Error(`A API respondeu ${resposta.status} ao listar as solicitações.`);
  }
  const corpo = (await resposta.json()) as RespostaLista;
  return corpo.itens;
}
