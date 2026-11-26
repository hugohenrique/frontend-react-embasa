import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { hojeISO } from "../../../shared/datas";
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

  test("envia o que foi preenchido", async () => {
    const aoCriar = vi.fn().mockResolvedValue({});
    const usuario = userEvent.setup();
    render(<FormularioOrdem equipes={equipes} aoCriar={aoCriar} />);

    await usuario.type(screen.getByLabelText("Número da solicitação"), " 26-08815 ");
    await usuario.selectOptions(screen.getByLabelText("Equipe"), "E02");
    await usuario.click(screen.getByRole("button", { name: "Criar ordem de serviço" }));

    expect(aoCriar).toHaveBeenCalledWith({ solicitacao: "26-08815", equipe: "E02", previsao: hojeISO() });
  });

  test("mostra no campo o erro que a API devolveu", async () => {
    const mensagem = "Já existe a OS-04151 em aberto para a solicitação 26-08815.";
    const aoCriar = vi.fn().mockResolvedValue({ solicitacao: mensagem });
    const usuario = userEvent.setup();
    render(<FormularioOrdem equipes={equipes} aoCriar={aoCriar} />);

    await usuario.type(screen.getByLabelText("Número da solicitação"), "26-08815");
    await usuario.selectOptions(screen.getByLabelText("Equipe"), "E02");
    await usuario.click(screen.getByRole("button", { name: "Criar ordem de serviço" }));

    expect(await screen.findByText(mensagem)).toBeInTheDocument();
    expect(screen.getByLabelText("Número da solicitação")).toHaveFocus();
  });
});
