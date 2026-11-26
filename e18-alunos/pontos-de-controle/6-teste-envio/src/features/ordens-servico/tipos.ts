// Os tipos das ordens de serviço, como a API da Central devolve (módulo fictício do curso).
import type { Prioridade, TipoServico } from "../solicitacoes";

export type StatusOrdem = "programada" | "em-execucao" | "concluida" | "impedida";

// Uma equipe de campo, como a API lista em /api/equipes
export type Equipe = {
  id: string;
  nome: string;
  base: string;
};

// O que o formulário manda para criar uma ordem: agora o tipo sai do esquema
export type { NovaOrdem } from "./esquemas";

// Uma ordem de serviço: o trabalho de campo que resolve uma solicitação
export type OrdemServico = {
  numero: string;
  solicitacao: string;
  equipe: string;
  nomeEquipe: string;
  previsao: string;
  status: StatusOrdem;
  observacao: string;
  // Um resumo da solicitação de origem, que a API manda junto
  tipo: TipoServico;
  municipio: string;
  bairro: string;
  prioridade: Prioridade;
};
