// A camada de acesso à API de ordens de serviço. Mesmo padrão do api.ts de solicitações.
import type { OrdemDeServico, StatusOrdem } from "./tipos";

const ENDERECO = "/api/ordens";
export const POR_PAGINA = 20;

export type FiltroStatusOrdem = StatusOrdem | "todos";

// O que a tela pede à API
export type ConsultaOrdens = {
  status: FiltroStatusOrdem;
  pagina: number;
};

// Uma página da lista, como a API devolve
export type PaginaDeOrdens = {
  itens: OrdemDeServico[];
  total: number;
  pagina: number;
  porPagina: number;
};

export async function listarOrdens(consulta: ConsultaOrdens): Promise<PaginaDeOrdens> {
  const parametros = new URLSearchParams();
  parametros.set("pagina", String(consulta.pagina));
  parametros.set("porPagina", String(POR_PAGINA));
  if (consulta.status !== "todos") parametros.set("status", consulta.status);

  const resposta = await fetch(`${ENDERECO}?${parametros}`);
  if (!resposta.ok) {
    throw new Error(`A API respondeu ${resposta.status} ao listar as ordens.`);
  }
  return (await resposta.json()) as PaginaDeOrdens;
}
