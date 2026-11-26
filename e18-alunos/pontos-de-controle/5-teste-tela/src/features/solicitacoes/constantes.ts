// Os valores fixos de uma solicitação, num lugar só.
// São os códigos que a API usa; a tela mostra os nomes do nomes.ts.
export const TipoServico = {
  VAZAMENTO: "vazamento",
  FALTA_AGUA: "falta-agua",
  RELIGACAO: "religacao",
} as const;

// O tipo sai da constante: "vazamento" | "falta-agua" | "religacao"
export type TipoServico = (typeof TipoServico)[keyof typeof TipoServico];

export const Prioridade = {
  BAIXA: "baixa",
  MEDIA: "media",
  ALTA: "alta",
} as const;

export type Prioridade = (typeof Prioridade)[keyof typeof Prioridade];
