// Regras de negócio da API da Central (fictícias, criadas para o curso).
// Ficam separadas do servidor: o servidor recebe o pedido, as regras decidem.

export const TIPOS = ["vazamento", "falta-agua", "religacao"];
export const PRIORIDADES = ["baixa", "media", "alta"];
export const STATUS = ["aberta", "em-atendimento", "concluida", "cancelada"];

// Para onde cada status pode ir. Concluída e cancelada são finais.
export const TRANSICOES = {
  "aberta": ["em-atendimento", "cancelada"],
  "em-atendimento": ["concluida", "cancelada"],
  "concluida": [],
  "cancelada": [],
};

const NOMES_STATUS = {
  "aberta": "aberta",
  "em-atendimento": "em atendimento",
  "concluida": "concluída",
  "cancelada": "cancelada",
};

function texto(valor) {
  return typeof valor === "string" ? valor.trim() : "";
}

// Confere uma solicitação nova. Devolve um objeto com um erro por campo (vazio = tudo certo).
export function validarNovaSolicitacao(dados) {
  const campos = {};
  if (!TIPOS.includes(dados.tipo)) campos.tipo = "Escolha o tipo de serviço.";
  if (texto(dados.municipio) === "") campos.municipio = "Escolha o município.";
  if (texto(dados.bairro).length < 3) campos.bairro = "Informe o bairro, com pelo menos 3 letras.";
  if (!PRIORIDADES.includes(dados.prioridade)) campos.prioridade = "Escolha a prioridade.";
  const relato = texto(dados.relato);
  if (dados.relato !== undefined && typeof dados.relato !== "string") {
    campos.relato = "O relato deve ser um texto.";
  } else if (relato.length > 500) {
    campos.relato = "O relato tem no máximo 500 caracteres.";
  } else if (dados.prioridade === "alta" && relato.length < 10) {
    // Regra de negócio que só o servidor conhece (por enquanto)
    campos.relato = "Prioridade alta exige um relato com pelo menos 10 caracteres.";
  }
  return campos;
}

// Confere uma mudança de status. Devolve { status, campos } ou { conflito }.
export function validarMudancaDeStatus(atual, dados) {
  const campos = {};
  if (!STATUS.includes(dados.status)) {
    campos.status = "Status desconhecido.";
    return { campos };
  }
  if (atual === dados.status) {
    return { conflito: `A solicitação já está ${NOMES_STATUS[atual]}.` };
  }
  if (!TRANSICOES[atual].includes(dados.status)) {
    return {
      conflito: `A solicitação está ${NOMES_STATUS[atual]} e não pode passar para ${NOMES_STATUS[dados.status]}.`,
    };
  }
  const observacao = texto(dados.observacao);
  if ((dados.status === "concluida" || dados.status === "cancelada") && observacao.length < 5) {
    campos.observacao = "Descreva o que foi feito, com pelo menos 5 caracteres.";
  } else if (observacao.length > 300) {
    campos.observacao = "A observação tem no máximo 300 caracteres.";
  }
  return { campos };
}
