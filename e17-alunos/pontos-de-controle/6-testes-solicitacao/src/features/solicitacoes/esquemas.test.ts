import { describe, expect, test } from "vitest";
import { esquemaNovaSolicitacao } from "./esquemas";

const solicitacaoValida = {
  tipo: "vazamento",
  municipio: "Salvador",
  bairro: "Pituba",
  prioridade: "media",
  relato: "",
};

describe("esquemaNovaSolicitacao", () => {
  test("recusa bairro com menos de 3 letras", () => {
    const resultado = esquemaNovaSolicitacao.safeParse({ ...solicitacaoValida, bairro: "Pi" });
    expect(resultado.error?.issues[0].message).toBe("Informe o bairro, com pelo menos 3 letras.");
  });

  test("prioridade alta sem relato: o erro aparece no campo relato", () => {
    const resultado = esquemaNovaSolicitacao.safeParse({ ...solicitacaoValida, prioridade: "alta" });
    expect(resultado.error?.issues[0].message).toBe(
      "Prioridade alta exige um relato com pelo menos 10 caracteres.",
    );
    expect(resultado.error?.issues[0].path).toEqual(["relato"]);
  });

  test("prioridade alta com relato de 10 caracteres é aceita", () => {
    const resultado = esquemaNovaSolicitacao.safeParse({
      ...solicitacaoValida,
      prioridade: "alta",
      relato: "Cano vazou",
    });
    expect(resultado.success).toBe(true);
  });
});
