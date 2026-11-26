import { describe, expect, test } from "vitest";
import { lerFiltroStatus, proximosStatusOrdem } from "./regras";

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

describe("proximosStatusOrdem", () => {
  test("a programada pode começar ou ter impedimento", () => {
    expect(proximosStatusOrdem("programada")).toEqual(["em-execucao", "impedida"]);
  });

  test("a concluída não vai para lugar nenhum", () => {
    expect(proximosStatusOrdem("concluida")).toEqual([]);
  });
});
