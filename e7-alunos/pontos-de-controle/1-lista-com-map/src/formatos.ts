// Funções e nomes para exibir os dados na tela.
// São os mesmos da etapa 1, agora num arquivo próprio, com export.

export const nomesDosTipos = {
  vazamento: "Vazamento",
  "falta-agua": "Falta d'água",
  religacao: "Religação",
};

export const nomesDasPrioridades = { baixa: "Baixa", media: "Média", alta: "Alta" };

// Converte "2026-11-09" em "09/11/2026"
export function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}
