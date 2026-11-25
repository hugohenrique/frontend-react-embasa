import { useState } from "react";
import { acoesDaOrdem } from "../nomes";
import { exigeObservacao, proximosStatusDaOrdem } from "../regras";
import type { OrdemDeServico, StatusOrdem } from "../tipos";
import { SeloOrdem } from "./SeloOrdem";

type AcoesOrdemProps = {
  ordem: OrdemDeServico;
  salvando: boolean;
  erro: string;
  aoMudar: (status: StatusOrdem, observacao: string) => void;
  aoFechar: () => void;
};

// As ações de uma ordem: um botão por status possível, e a observação quando a regra pede
export function AcoesOrdem({ ordem, salvando, erro, aoMudar, aoFechar }: AcoesOrdemProps) {
  const [observacao, setObservacao] = useState("");
  const proximos = proximosStatusDaOrdem(ordem.status);

  return (
    <section className="acoes-ordem" aria-labelledby="acoes-ordem-titulo">
      <div className="detalhe-topo">
        <h3 id="acoes-ordem-titulo">
          {ordem.numero} · {ordem.bairro}, {ordem.municipio}
        </h3>
        <button type="button" className="botao-linha" onClick={aoFechar}>Fechar</button>
      </div>
      <p><SeloOrdem status={ordem.status} /> {ordem.nomeEquipe}</p>

      {proximos.length === 0 ? (
        <p>Ordem concluída. {ordem.observacao}</p>
      ) : (
        <>
          {proximos.some(exigeObservacao) && (
            <>
              <label htmlFor="ordem-observacao">Observação</label>
              <textarea
                id="ordem-observacao"
                rows={2}
                maxLength={300}
                value={observacao}
                onChange={(evento) => setObservacao(evento.target.value)}
                aria-invalid={erro ? true : undefined}
                aria-describedby={erro ? "ordem-observacao-erro" : "ordem-observacao-dica"}
              />
            </>
          )}
          {erro ? (
            <p className="erro-campo" id="ordem-observacao-erro" role="alert">{erro}</p>
          ) : (
            <p className="contador" id="ordem-observacao-dica">Obrigatória para concluir ou registrar impedimento.</p>
          )}
          <div className="acoes">
            {proximos.map((proximo) => (
              <button
                key={proximo}
                type="button"
                className={proximo === "impedida" ? "botao-secundario" : undefined}
                disabled={salvando}
                onClick={() => aoMudar(proximo, observacao)}
              >
                {acoesDaOrdem[proximo]}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
