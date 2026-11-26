import { describe, expect, test } from "vitest";
import { lerFiltroStatus } from "./regras";

describe("lerFiltroStatus", () => {
  test("aceita um status que existe", () => {
    expect(lerFiltroStatus("programada")).toBe("programada");
  });

  test("troca qualquer outro texto por todos", () => {
    expect(lerFiltroStatus("qualquer-coisa")).toBe("todos");
  });

  test("sem status no endereço, é todos", () => {
    expect(lerFiltroStatus(null)).toBe("todos");
  });
});
