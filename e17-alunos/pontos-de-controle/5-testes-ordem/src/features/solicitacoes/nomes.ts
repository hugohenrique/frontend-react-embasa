import type { Tom } from "../../shared/ui/Selo";
import type { Status } from "./tipos";

// Os nomes de exibição dos tipos e das prioridades
export const nomesDosTipos = {
  vazamento: "Vazamento",
  "falta-agua": "Falta d'água",
  religacao: "Religação",
};

export const nomesDasPrioridades = { baixa: "Baixa", media: "Média", alta: "Alta" };

export const nomesDosStatus = {
  aberta: "Aberta",
  "em-atendimento": "Em atendimento",
  concluida: "Concluída",
  cancelada: "Cancelada",
};

// A cor de cada status, pelo que ela comunica
export const tonsDosStatus: Record<Status, Tom> = {
  aberta: "informacao",
  "em-atendimento": "andamento",
  concluida: "sucesso",
  cancelada: "neutro",
};

// O texto do botão que leva a cada status
export const acoesDosStatus = {
  aberta: "Reabrir",
  "em-atendimento": "Iniciar atendimento",
  concluida: "Concluir",
  cancelada: "Cancelar",
};
