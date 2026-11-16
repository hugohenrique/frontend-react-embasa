// Solicitações de exemplo. Dados fictícios.
// Na etapa 3, esta lista vai vir da API.
import type { Solicitacao } from "./tipos";

export const solicitacoes: Solicitacao[] = [
  { numero: "26-08824", tipo: "falta-agua", municipio: "Salvador", bairro: "Cajazeiras", prioridade: "alta", abertura: "2026-11-11" },
  { numero: "26-08823", tipo: "vazamento", municipio: "Lauro de Freitas", bairro: "Ipitanga", prioridade: "media", abertura: "2026-11-11" },
  { numero: "26-08822", tipo: "religacao", municipio: "Juazeiro", bairro: "Centro", prioridade: "baixa", abertura: "2026-11-10" },
  { numero: "26-08821", tipo: "vazamento", municipio: "Ilhéus", bairro: "Pontal", prioridade: "alta", abertura: "2026-11-10" },
  { numero: "26-08817", tipo: "vazamento", municipio: "Salvador", bairro: "Itapuã", prioridade: "alta", abertura: "2026-11-09" },
  { numero: "26-08816", tipo: "falta-agua", municipio: "Feira de Santana", bairro: "Centro", prioridade: "alta", abertura: "2026-11-09" },
  { numero: "26-08815", tipo: "religacao", municipio: "Camaçari", bairro: "Gleba A", prioridade: "media", abertura: "2026-11-06" },
  { numero: "26-08814", tipo: "vazamento", municipio: "Vitória da Conquista", bairro: "Candeias", prioridade: "baixa", abertura: "2026-11-06" },
];
