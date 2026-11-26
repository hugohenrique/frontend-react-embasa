import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { hojeISO } from "../../../shared/datas";
import type { ErrosDosCampos } from "../api";
import type { Equipe, NovaOrdem } from "../tipos";
import { esquemaNovaOrdem } from "../esquemas";

type FormularioOrdemProps = {
  equipes: Equipe[];
  aoCriar: (nova: NovaOrdem) => Promise<ErrosDosCampos>;
};

export function FormularioOrdem({ equipes, aoCriar }: FormularioOrdemProps) {
  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(esquemaNovaOrdem),
    defaultValues: {
      solicitacao: "",
      equipe: "",
      previsao: hojeISO()
    }
  });

  async function criar(nova: NovaOrdem) {
    const errosApi = await aoCriar(nova);

    if (Object.keys(errosApi).length === 0) {
      reset();
      return;
    }

    Object.entries(errosApi).forEach(
      ([campo, mensagem], posicao) => {
        const nome = campo === "geral" ? "root" : (campo as keyof NovaOrdem)
        setError(
          nome,
          { message: mensagem },
          { shouldFocus: posicao === 0 }
        );
      }
    );
  }

  return (
    <form onSubmit={handleSubmit(criar)}>
      {errors.root && <p className="erro-carregamento" role="alert">{errors.root.message}</p>}
      <div className="campos">
        <div className="campo">
          <label htmlFor="ordem-solicitacao">Número da solicitação</label>
          <input
            id="ordem-solicitacao"
            placeholder="26-08815"
            aria-invalid={errors.solicitacao ? true : undefined}
            aria-describedby={errors.solicitacao ? "ordem-solicitacao-erro" : undefined}
            {...register("solicitacao")}
          />
          {errors.solicitacao &&
            <p className="erro-campo" id="ordem-solicitacao-erro">{errors.solicitacao.message}</p>}
        </div>
        <div className="campo">
          <label htmlFor="ordem-equipe">Equipe</label>
          <select
            id="ordem-equipe"
            aria-invalid={errors.equipe ? true : undefined}
            aria-describedby={errors.equipe ? "ordem-equipe-erro" : undefined}
            {...register("equipe")}
          >
            <option value="">Escolha a equipe</option>
            {equipes.map((item) => (
              <option key={item.id} value={item.id}>{item.nome} · {item.base}</option>
            ))}
          </select>
          {errors.equipe &&
            <p className="erro-campo" id="ordem-equipe-erro">{errors.equipe.message}</p>}
        </div>
        <div className="campo">
          <label htmlFor="ordem-previsao">Data prevista</label>
          <input
            id="ordem-previsao"
            type="date"
            aria-invalid={errors.previsao ? true : undefined}
            aria-describedby={errors.previsao ? "ordem-previsao-erro" : undefined}
            {...register("previsao")}
          />
          {errors.previsao &&
            <p className="erro-campo" id="ordem-previsao-erro">{errors.previsao.message}</p>}
        </div>
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Criando…" : "Criar ordem de serviço"}
      </button>
    </form>
  );
}
