// Os tipos das ordens de serviço, como a API da Central devolve (módulo fictício do curso).
import type { Prioridade, TipoServico } from "../solicitacoes";

export type StatusOrdem = "programada" | "em-execucao" | "concluida" | "impedida";

// Uma ordem de serviço: o trabalho de campo que resolve uma solicitação
export type OrdemDeServico = {
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

export type Equipe = {
  id: string;
  nome: string;
  base: string;
};

export type NovaOrdem = {
  solicitacao: string;
  equipe: string;
  previsao: string;
};
