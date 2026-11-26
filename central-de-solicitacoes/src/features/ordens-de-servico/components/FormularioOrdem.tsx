import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { hojeISO } from "../../../shared/datas";
import type { ErrosDosCampos } from "../api";
import type { Equipe, NovaOrdem } from "../tipos";

type FormularioOrdemProps = {
  equipes: Equipe[];
  erros: ErrosDosCampos;
  enviando: boolean;
  aoCriar: (nova: NovaOrdem) => Promise<boolean>;
};

// Mesmo padrão do formulário de solicitação: campos controlados, erros vindos da API
export function FormularioOrdem({ equipes, erros, enviando, aoCriar }: FormularioOrdemProps) {
  const [solicitacao, setSolicitacao] = useState("");
  const [equipe, setEquipe] = useState("");
  const [previsao, setPrevisao] = useState(hojeISO());

  // 1. OK criar uma ref para um elemento
  // 2. OK quando os erros mudarem/existem, eu vou levar o foco para o PRIMEIRO campo com erro
  // 3. OK quem usa o teclado ou leitor de tela vai direto ao erro/problema

  const formulario = useRef<HTMLFormElement>(null);

  useEffect(
    () => {
      const primeiroComErro = formulario.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      primeiroComErro?.focus();
    },
    [erros]
  );

  async function criar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const criou = await aoCriar({ solicitacao: solicitacao.trim(), equipe, previsao });
    if (!criou) return;
    setSolicitacao("");
    setEquipe("");
    setPrevisao(hojeISO());
  }

  return (
    <form ref={formulario} onSubmit={criar}>
      {erros.geral && <p className="erro-carregamento" role="alert">{erros.geral}</p>}
      <div className="campos">
        <div className="campo">
          <label htmlFor="ordem-solicitacao">Número da solicitação</label>
          <input
            id="ordem-solicitacao"
            value={solicitacao}
            onChange={(evento) => setSolicitacao(evento.target.value)}
            placeholder="26-08815"
            aria-invalid={erros.solicitacao ? true : undefined}
            aria-describedby={erros.solicitacao ? "ordem-solicitacao-erro" : undefined}
          />
          {erros.solicitacao && <p className="erro-campo" id="ordem-solicitacao-erro">{erros.solicitacao}</p>}
        </div>
        <div className="campo">
          <label htmlFor="ordem-equipe">Equipe</label>
          <select
            id="ordem-equipe"
            value={equipe}
            onChange={(evento) => setEquipe(evento.target.value)}
            aria-invalid={erros.equipe ? true : undefined}
            aria-describedby={erros.equipe ? "ordem-equipe-erro" : undefined}
          >
            <option value="">Escolha a equipe</option>
            {equipes.map((item) => (
              <option key={item.id} value={item.id}>{item.nome} · {item.base}</option>
            ))}
          </select>
          {erros.equipe && <p className="erro-campo" id="ordem-equipe-erro">{erros.equipe}</p>}
        </div>
        <div className="campo">
          <label htmlFor="ordem-previsao">Data prevista</label>
          <input
            id="ordem-previsao"
            type="date"
            value={previsao}
            onChange={(evento) => setPrevisao(evento.target.value)}
            aria-invalid={erros.previsao ? true : undefined}
            aria-describedby={erros.previsao ? "ordem-previsao-erro" : undefined}
          />
          {erros.previsao && <p className="erro-campo" id="ordem-previsao-erro">{erros.previsao}</p>}
        </div>
      </div>
      <button type="submit" disabled={enviando}>
        {enviando ? "Criando…" : "Criar ordem de serviço"}
      </button>
    </form>
  );
}
