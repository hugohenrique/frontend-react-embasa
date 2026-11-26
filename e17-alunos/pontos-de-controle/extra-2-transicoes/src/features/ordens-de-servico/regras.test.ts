import { describe, expect, test } from "vitest";
import { lerFiltroStatus, proximosStatusDaOrdem } from "./regras";

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

describe("proximosStatusDaOrdem", () => {
  test("a programada pode começar ou ter impedimento", () => {
    expect(proximosStatusDaOrdem("programada")).toEqual(["em-execucao", "impedida"]);
  });

  test("a concluída não vai para lugar nenhum", () => {
    expect(proximosStatusDaOrdem("concluida")).toEqual([]);
  });
});
