// Regras de negócio das ordens de serviço. Funções puras, como em solicitações.
import type { ErrosDosCampos, FiltroStatusOrdem } from "./api";
import type { NovaOrdem, StatusOrdem } from "./tipos";

// Para onde cada status pode ir. É a mesma regra da API: a tela mostra só os botões possíveis.
const TRANSICOES: Record<StatusOrdem, StatusOrdem[]> = {
  programada: ["em-execucao", "impedida"],
  "em-execucao": ["concluida", "impedida"],
  impedida: ["programada"],
  concluida: [],
};

export function proximosStatusDaOrdem(status: StatusOrdem): StatusOrdem[] {
  return TRANSICOES[status];
}

// Concluir e registrar impedimento pedem uma observação
export function exigeObservacao(status: StatusOrdem): boolean {
  return status === "concluida" || status === "impedida";
}

// O endereço é texto que qualquer pessoa pode digitar: só aceita um filtro que existe
const FILTROS: FiltroStatusOrdem[] = ["todos", "programada", "em-execucao", "impedida", "concluida"];

export function lerFiltroStatus(texto: string | null): FiltroStatusOrdem {
  return FILTROS.find((filtro) => filtro === texto) ?? "todos";
}

// O que o navegador consegue conferir sozinho, antes de chamar a API.
// Se a solicitação existe, ou se está em atendimento, só a API sabe.
export function validarNovaOrdem(nova: NovaOrdem, hoje: string): ErrosDosCampos {
  const erros: ErrosDosCampos = {};
  if (nova.solicitacao === "") erros.solicitacao = "Informe o número da solicitação.";
  if (nova.equipe === "") erros.equipe = "Escolha a equipe.";
  if (nova.previsao === "") erros.previsao = "Informe a data prevista.";
  else if (nova.previsao < hoje) erros.previsao = "A data prevista não pode ser no passado.";
  return erros;
}
