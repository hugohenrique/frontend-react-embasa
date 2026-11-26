import { describe, expect, test } from "vitest";
import { hojeISO } from "../../shared/datas";
import { esquemaNovaOrdem } from "./esquemas";

const ordemValidada = {
  solicitacao: "26-08815",
  equipe: "E01",
  previsao: hojeISO(),
};

describe("esquemaNovaOrdem", () => {
  test("aceita uma ordem preenchida, com a data de hoje", () => {
    const resultado = esquemaNovaOrdem.safeParse(ordemValidada);
    expect(resultado.success).toBe(true);
  });
  test("recusa data no passado", () => {
    const resultado = esquemaNovaOrdem.safeParse({
      ...ordemValidada,
      previsao: "2025-05-21"
    });
    expect(resultado.error?.issues[0].message).toBe("A data prevista não pode ser no passado.")
  });
});
