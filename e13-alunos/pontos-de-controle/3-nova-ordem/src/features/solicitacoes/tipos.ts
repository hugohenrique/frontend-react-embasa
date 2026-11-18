// Os tipos do domínio: as opções fixas de uma solicitação de serviço.
export type TipoServico = "vazamento" | "falta-agua" | "religacao";
export type Prioridade = "baixa" | "media" | "alta";
export type Status = "aberta" | "em-atendimento" | "concluida" | "cancelada";

// Uma solicitação de serviço completa
export type Solicitacao = {
  numero: string;
  tipo: TipoServico;
  municipio: string;
  bairro: string;
  prioridade: Prioridade;
  abertura: string;
  status: Status;
  relato?: string;
};

// Uma mudança de status, como a API registra
export type EventoHistorico = {
  de: Status | null;
  para: Status;
  observacao: string;
  em: string;
};

// A solicitação com o histórico, como vem da API no detalhe
export type SolicitacaoDetalhada = Solicitacao & {
  historico: EventoHistorico[];
};

// O que o formulário entrega: a solicitação sem número, data e status,
// que são definidos por quem registra
export type NovaSolicitacao = Omit<Solicitacao, "numero" | "abertura" | "status">;
