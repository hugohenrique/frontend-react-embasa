import { z } from "zod";
import { hojeISO } from "../../shared/datas";

// As regras de uma ordem nova, num lugar só, com as mesmas mensagens da API.
// O navegador confere antes de enviar; a API confere de novo, porque é ela quem garante.
export const esquemaNovaOrdem = z.object({
  solicitacao: z.string().trim().min(1, "Informe o número da solicitação."),
  equipe: z.string().min(1, "Escolha a equipe."),
  previsao: z
    .string()
    .min(1, "Informe a data prevista.")
    .refine((data) => data >= hojeISO(), "A data prevista não pode ser no passado."),
});

// O tipo sai do esquema: mudou a regra, o tipo acompanha
export type NovaOrdem = z.infer<typeof esquemaNovaOrdem>;
