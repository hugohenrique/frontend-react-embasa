import type { Tom } from "../../shared/ui/Selo";
import type { StatusOrdem } from "./tipos";

// Como cada status da ordem aparece na tela
export const nomesDosStatusDaOrdem = {
  programada: "Programada",
  "em-execucao": "Em execução",
  concluida: "Concluída",
  impedida: "Impedida",
};

// A cor de cada status da ordem: impedida é o único perigo
export const tonsDaOrdem: Record<StatusOrdem, Tom> = {
  programada: "informacao",
  "em-execucao": "andamento",
  concluida: "sucesso",
  impedida: "perigo",
};

// O texto do botão que leva a cada status
export const acoesDaOrdem = {
  programada: "Reprogramar",
  "em-execucao": "Iniciar execução",
  concluida: "Concluir",
  impedida: "Registrar impedimento",
};
