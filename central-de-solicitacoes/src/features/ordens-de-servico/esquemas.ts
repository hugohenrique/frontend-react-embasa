import { z } from "zod";
import { hojeISO } from "../../shared/datas";

export const esquemaNovaOrdem = z.object({
  solicitacao: z.string().trim().min(1, "Informe o número da solicitação."),
  equipe: z.string().min(1, "Escolha a equipe."),
  previsao: z
    .string()
    .min(1, "Informe a data prevista.")
    .refine((data) => data >= hojeISO(), "A data prevista não pode ser no passado.")
});

export type NovaOrdem = z.infer<typeof esquemaNovaOrdem>;
