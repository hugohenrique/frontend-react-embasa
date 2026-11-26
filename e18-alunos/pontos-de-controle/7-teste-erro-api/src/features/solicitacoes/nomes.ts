import type { Tom } from "../../shared/ui/Selo";
import { Prioridade, TipoServico } from "./constantes";
import type { Status } from "./tipos";

// Os nomes de exibição dos tipos e das prioridades
export const nomesTipos: Record<TipoServico, string> = {
  [TipoServico.VAZAMENTO]: "Vazamento",
  [TipoServico.FALTA_AGUA]: "Falta d'água",
  [TipoServico.RELIGACAO]: "Religação",
};

export const nomesPrioridades: Record<Prioridade, string> = {
  [Prioridade.BAIXA]: "Baixa",
  [Prioridade.MEDIA]: "Média",
  [Prioridade.ALTA]: "Alta",
};

export const nomesStatus = {
  aberta: "Aberta",
  "em-atendimento": "Em atendimento",
  concluida: "Concluída",
  cancelada: "Cancelada",
};

// A cor de cada status, pelo que ela comunica
export const tonsStatus: Record<Status, Tom> = {
  aberta: "informacao",
  "em-atendimento": "andamento",
  concluida: "sucesso",
  cancelada: "neutro",
};

// O texto do botão que leva a cada status
export const acoesStatus = {
  aberta: "Reabrir",
  "em-atendimento": "Iniciar atendimento",
  concluida: "Concluir",
  cancelada: "Cancelar",
};
