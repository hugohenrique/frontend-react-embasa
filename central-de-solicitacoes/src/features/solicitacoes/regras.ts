// Regras de negócio da Central de Solicitações.
// Funções puras: recebem dados e devolvem dados. Não usam React e não mexem na tela.
import type { ErrosDosCampos } from "./api";
import type { NovaSolicitacao, Prioridade, Solicitacao, Status } from "./tipos";

export type FiltroPrioridade = Prioridade | "todas";

// Os filtros da lista. Quem aplica é a API; a tela só guarda o que foi escolhido.
export type Filtros = {
  prioridade: FiltroPrioridade;
  busca: string;
};

// Urgente, na Central, é prioridade alta e ainda não resolvida
export function ehUrgente(solicitacao: Solicitacao): boolean {
  return (
    solicitacao.prioridade === "alta" &&
    (solicitacao.status === "aberta" || solicitacao.status === "em-atendimento")
  );
}

// Para onde cada status pode ir. É a mesma regra da API: a tela usa para mostrar
// só os botões possíveis, e a API confere de novo, porque é ela quem decide.
const TRANSICOES: Record<Status, Status[]> = {
  aberta: ["em-atendimento", "cancelada"],
  "em-atendimento": ["concluida", "cancelada"],
  concluida: [],
  cancelada: [],
};

export function proximosStatus(status: Status): Status[] {
  return TRANSICOES[status];
}

// As duas regras da API que o navegador consegue conferir antes de enviar
export function validarNovaSolicitacao(nova: NovaSolicitacao): ErrosDosCampos {
  const erros: ErrosDosCampos = {};
  if (nova.bairro.trim().length < 3) erros.bairro = "Informe o bairro, com pelo menos 3 letras.";
  if (nova.prioridade === "alta" && (nova.relato ?? "").trim().length < 10) {
    erros.relato = "Prioridade alta exige um relato com pelo menos 10 caracteres.";
  }
  return erros;
}
