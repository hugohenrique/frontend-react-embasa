import { z } from "zod";

const esquemaNovaSolicitacao = z
  .object({
    tipo: z.enum(["vazamento", "falta-agua", "religacao"], "Escolha o tipo de serviço"),
    municipio: z.string().trim().min(1, "Escolha o municipio"),
    bairro: z.string().trim().min(3, "Escolha o bairro"),
    prioridade: z.enum(["baixa", "media", "alta"]),
    relato: z.string().max(500, "O relato tem que ter no máximo 500 caracteres").optional()
  })
  .refine(
    (nova) => nova.prioridade !== "alta" ||
      ((nova.relato ?? "").trim().length >= 10),
    {
      error: "Prioridade alta exige um relato com pelo menos 10 caracteres.",
      path: ["relato"]
    }
  );
