// Regras de negócio das ordens de serviço. Funções puras, como em solicitações.
import type { FiltroStatusOrdem } from "./api";
import type { StatusOrdem } from "./tipos";

// Para onde cada status pode ir. É a mesma regra da API: a tela mostra só os botões possíveis.
const TRANSICOES: Record<StatusOrdem, StatusOrdem[]> = {
  programada: ["em-execucao", "impedida"],
  "em-execucao": ["concluida", "impedida"],
  impedida: ["programada"],
  concluida: [],
};

const FILTROS: FiltroStatusOrdem[] = [
  "todos",
  "programada",
  "em-execucao",
  "impedida",
  "concluida"
];

export function proximosStatusDaOrdem(status: StatusOrdem): StatusOrdem[] {
  return TRANSICOES[status];
}

// Concluir e registrar impedimento pedem uma observação
export function exigeObservacao(status: StatusOrdem): boolean {
  return status === "concluida" || status === "impedida";
}

export function lerFiltroStatus(texto: string): FiltroStatusOrdem {
  return FILTROS.find((filtro) => filtro === texto) ?? "todos";
}
