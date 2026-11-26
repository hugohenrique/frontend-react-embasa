import { describe, expect, test } from "vitest";
import { hojeISO } from "../../shared/datas";
import { esquemaNovaOrdem } from "./esquemas";

// Uma ordem certa. Cada teste muda um campo só, para saber exatamente o que está sendo testado.
const ordemValida = { solicitacao: "26-08815", equipe: "E01", previsao: hojeISO() };

describe("esquemaNovaOrdem", () => {
  test("aceita uma ordem preenchida, com a data de hoje", () => {
    const resultado = esquemaNovaOrdem.safeParse(ordemValida);
    expect(resultado.success).toBe(true);
  });

  test("recusa uma data no passado", () => {
    const resultado = esquemaNovaOrdem.safeParse({ ...ordemValida, previsao: "2025-05-21" });
    expect(resultado.error?.issues[0].message).toBe("A data prevista não pode ser no passado.");
  });
});
