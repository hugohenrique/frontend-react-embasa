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
  relato?: string;
};

// O que o formulário entrega: a solicitação sem número e sem data,
// que são definidos por quem registra
export type NovaSolicitacao = Omit<Solicitacao, "numero" | "abertura">;
