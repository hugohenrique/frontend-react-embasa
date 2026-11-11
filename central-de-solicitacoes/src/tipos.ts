// Os tipos do domínio: as opções fixas de uma solicitação de serviço.
export type TipoServico = "vazamento" | "falta-agua" | "religacao";
export type Prioridade = "baixa" | "media" | "alta";

// Uma solicitação de serviço completa
export type Solicitacao = {
  numero: string;
  tipo: TipoServico;
  municipio: string;
  bairro: string;
  prioridade: Prioridade;
  abertura: string;
};
