import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { hojeISO } from "../../../shared/datas";
import type { ErrosCampos } from "../api";
import { esquemaNovaOrdem } from "../esquemas";
import type { Equipe, NovaOrdem } from "../tipos";

type FormularioOrdemProps = {
  equipes: Equipe[];
  // Envia para a API e devolve os erros que ela apontou; vazio quer dizer "criou"
  aoCriar: (nova: NovaOrdem) => Promise<ErrosCampos>;
};

// O React Hook Form guarda os campos e os erros; o esquema do Zod diz o que é válido
export function FormularioOrdem({ equipes, aoCriar }: FormularioOrdemProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(esquemaNovaOrdem),
    defaultValues: { solicitacao: "", equipe: "", previsao: hojeISO() },
  });

  // Só é chamada se o esquema aprovou. O que a API recusar aparece no campo certo.
  async function criar(nova: NovaOrdem) {
    const errosApi = await aoCriar(nova);
    if (Object.keys(errosApi).length === 0) {
      reset();
      return;
    }
    // "geral" não é campo: vai para o erro do formulário todo, o root.
    // O foco vai para o primeiro campo que a API recusou.
    Object.entries(errosApi).forEach(([campo, mensagem], posicao) => {
      const nome = campo === "geral" ? "root" : (campo as keyof NovaOrdem);
      setError(nome, { message: mensagem }, { shouldFocus: posicao === 0 });
    });
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
            {...register("solicitacao")}
            aria-invalid={errors.solicitacao ? true : undefined}
            aria-describedby={errors.solicitacao ? "ordem-solicitacao-erro" : undefined}
          />
          {errors.solicitacao && <p className="erro-campo" id="ordem-solicitacao-erro">{errors.solicitacao.message}</p>}
        </div>
        <div className="campo">
          <label htmlFor="ordem-equipe">Equipe</label>
          <select
            id="ordem-equipe"
            {...register("equipe")}
            aria-invalid={errors.equipe ? true : undefined}
            aria-describedby={errors.equipe ? "ordem-equipe-erro" : undefined}
          >
            <option value="">Escolha a equipe</option>
            {equipes.map((item) => (
              <option key={item.id} value={item.id}>{item.nome} · {item.base}</option>
            ))}
          </select>
          {errors.equipe && <p className="erro-campo" id="ordem-equipe-erro">{errors.equipe.message}</p>}
        </div>
        <div className="campo">
          <label htmlFor="ordem-previsao">Data prevista</label>
          <input
            id="ordem-previsao"
            type="date"
            {...register("previsao")}
            aria-invalid={errors.previsao ? true : undefined}
            aria-describedby={errors.previsao ? "ordem-previsao-erro" : undefined}
          />
          {errors.previsao && <p className="erro-campo" id="ordem-previsao-erro">{errors.previsao.message}</p>}
        </div>
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Criando…" : "Criar ordem de serviço"}
      </button>
    </form>
  );
}
