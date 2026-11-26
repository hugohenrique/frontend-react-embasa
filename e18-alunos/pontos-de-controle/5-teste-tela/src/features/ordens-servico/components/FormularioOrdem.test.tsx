import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import type { Equipe } from "../tipos";
import { FormularioOrdem } from "./FormularioOrdem";

// Equipes de exemplo: o teste não chama a API
const equipes: Equipe[] = [
  { id: "E01", nome: "Equipe 01", base: "Salvador" },
  { id: "E02", nome: "Equipe 02", base: "Salvador" },
];

describe("FormularioOrdem", () => {
  test("mostra os erros e não envia quando falta o número e a equipe", async () => {
    const aoCriar = vi.fn();
    const usuario = userEvent.setup();
    render(<FormularioOrdem equipes={equipes} aoCriar={aoCriar} />);

    await usuario.click(screen.getByRole("button", { name: "Criar ordem de serviço" }));

    expect(await screen.findByText("Informe o número da solicitação.")).toBeInTheDocument();
    expect(screen.getByText("Escolha a equipe.")).toBeInTheDocument();
    expect(aoCriar).not.toHaveBeenCalled();
  });
});
