import { nomesDasPrioridades } from "../nomes";
import type { Filtros, FiltroPrioridade } from "../regras";

type FiltrosSolicitacoesProps = {
  filtros: Filtros;
  aoMudar: (filtros: Filtros) => void;
};

// Campos controlados por quem usa o componente: ele mostra os filtros e avisa quando mudam
export function FiltrosSolicitacoes({ filtros, aoMudar }: FiltrosSolicitacoesProps) {
  return (
    <>
      <div className="filtros">
        <div>
          <label htmlFor="filtro-prioridade">Prioridade</label>
          <select
            id="filtro-prioridade"
            value={filtros.prioridade}
            onChange={(evento) =>
              aoMudar({ ...filtros, prioridade: evento.target.value as FiltroPrioridade })
            }
          >
            <option value="todas">Todas</option>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>
        </div>
        <div>
          <label htmlFor="busca-bairro">Buscar por bairro</label>
          <input
            type="search"
            id="busca-bairro"
            value={filtros.busca}
            onChange={(evento) => aoMudar({ ...filtros, busca: evento.target.value })}
          />
        </div>
      </div>
      <div className="acoes">
        <button
          type="button"
          className="botao-secundario"
          onClick={() => aoMudar({ prioridade: "todas", busca: "" })}
        >
          Limpar filtros
        </button>
      </div>
      <p className="total" aria-live="polite">
        {filtros.prioridade === "todas"
          ? "Mostrando todas as prioridades."
          : `Mostrando só a prioridade ${nomesDasPrioridades[filtros.prioridade]}.`}
      </p>
    </>
  );
}
