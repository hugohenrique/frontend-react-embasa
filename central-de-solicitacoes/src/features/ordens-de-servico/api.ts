// A camada de acesso à API de ordens de serviço. Mesmo padrão do api.ts de solicitações.
import type { Equipe, NovaOrdem, OrdemDeServico, StatusOrdem } from "./tipos";

const ENDERECO = "/api/ordens";
export const POR_PAGINA = 20;

export type ErrosDosCampos = Record<string, string>;

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

export type ResultadoCriacao =
  | { tipo: "criada", ordem: OrdemDeServico }
  | { tipo: "recusada", campos: ErrosDosCampos }
  | { tipo: "conflito", mensagem: string };

export type ResultadoMudanca =
  | { tipo: "alterada"; ordem: OrdemDeServico }
  | { tipo: "recusada"; campos: ErrosDosCampos }
  | { tipo: "conflito"; mensagem: string };

export async function listarEquipes(): Promise<Equipe[]> {
  const resposta = await fetch("/api/equipes");
  if (!resposta.ok) {
    throw new Error(`A API respondeu ${resposta.status} ao listar as equipes.`);
  }
  return (await resposta.json()) as Equipe[];
}

export async function listarOrdens(consulta: ConsultaOrdens): Promise<PaginaDeOrdens> {
  const parametros = new URLSearchParams();
  parametros.set("pagina", String(consulta.pagina));
  parametros.set("porPagina", String(POR_PAGINA));

  if (consulta.status !== "todos") {
    parametros.set("status", consulta.status);
  }

  const resposta = await fetch(`${ENDERECO}?${parametros}`);
  if (!resposta.ok) {
    throw new Error(`A API respondeu ${resposta.status} ao listar as ordens.`);
  }

  return (await resposta.json()) as PaginaDeOrdens;
}

export async function criarOrdem(nova: NovaOrdem): Promise<ResultadoCriacao> {
  const resposta = await fetch(
    ENDERECO,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nova)
    }
  );

  if (resposta.status === 422) {
    const corpo = (await resposta.json()) as { campos: ErrosDosCampos };
    return {
      tipo: "recusada",
      campos: corpo.campos
    };
  }

  if (resposta.status === 409) {
    const corpo = (await resposta.json()) as { mensagem: string };
    return {
      tipo: "conflito",
      mensagem: corpo.mensagem
    };
  }

  if (!resposta.ok) {
    throw new Error("A API respondeu " + resposta.status + " ao criar a ordem");
  }

  return {
    tipo: "criada",
    ordem: (await resposta.json()) as OrdemDeServico
  };
}

export async function mudarStatusDaOrdem(
  numero: string,
  status: StatusOrdem,
  observacao: string
): Promise<ResultadoMudanca> {
  const resposta = await fetch(`${ENDERECO}/${encodeURIComponent(numero)}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, observacao }),
  });

  if (resposta.status === 422) {
    const corpo = (await resposta.json()) as { campos: ErrosDosCampos };
    return { tipo: "recusada", campos: corpo.campos };
  }

  if (resposta.status === 409) {
    const corpo = (await resposta.json()) as { mensagem: string };
    return { tipo: "conflito", mensagem: corpo.mensagem };
  }

  if (!resposta.ok) {
    throw new Error(`A API respondeu ${resposta.status} ao mudar a ordem ${numero}.`);
  }

  return { tipo: "alterada", ordem: (await resposta.json()) as OrdemDeServico };
}
