import { z } from "zod";

// As regras de uma solicitação nova, com as mesmas mensagens da API.
// Uma regra que olha dois campos fica no objeto todo, e o path diz em que campo o erro aparece.
export const esquemaNovaSolicitacao = z
  .object({
    tipo: z.enum(["vazamento", "falta-agua", "religacao"], "Escolha o tipo de serviço."),
    municipio: z.string().min(1, "Escolha o município."),
    bairro: z.string().trim().min(3, "Informe o bairro, com pelo menos 3 letras."),
    prioridade: z.enum(["baixa", "media", "alta"], "Escolha a prioridade."),
    relato: z.string().max(500, "O relato tem no máximo 500 caracteres.").optional(),
  })
  .refine((nova) => nova.prioridade !== "alta" || (nova.relato ?? "").trim().length >= 10, {
    error: "Prioridade alta exige um relato com pelo menos 10 caracteres.",
    path: ["relato"],
  });
