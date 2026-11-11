import { useState } from "react";
import type { FormEvent } from "react";
import type { Prioridade, TipoServico } from "../tipos";

const municipios = [
  "Salvador",
  "Feira de Santana",
  "Vitória da Conquista",
  "Camaçari",
  "Juazeiro",
  "Ilhéus",
  "Lauro de Freitas",
];
const LIMITE_RELATO = 500;

export function FormularioSolicitacao() {
  const [tipo, setTipo] = useState<TipoServico | "">("");
  const [ruaToda, setRuaToda] = useState(false);
  const [municipio, setMunicipio] = useState("");
  const [bairro, setBairro] = useState("");
  const [prioridade, setPrioridade] = useState<Prioridade | "">("");
  const [relato, setRelato] = useState("");

  // O botão só fica ativo com os campos obrigatórios preenchidos
  const podeRegistrar =
    tipo !== "" && municipio !== "" && bairro.trim() !== "" && prioridade !== "";

  function mudarTipo(novoTipo: TipoServico | "") {
    setTipo(novoTipo);
    if (novoTipo !== "falta-agua") setRuaToda(false);
  }

  // Regra de exemplo do curso: falta d'água na rua toda é prioridade alta
  function mudarRuaToda(marcado: boolean) {
    setRuaToda(marcado);
    if (marcado) setPrioridade("alta");
  }

  function registrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    console.log("Registrar:", { tipo, municipio, bairro, prioridade, relato });
  }

  return (
    <form onSubmit={registrar}>
      <div className="campos">
        <div className="campo">
          <label htmlFor="nova-tipo">Tipo de serviço</label>
          <select
            id="nova-tipo"
            value={tipo}
            onChange={(evento) => mudarTipo(evento.target.value as TipoServico | "")}
          >
            <option value="">Selecione o tipo</option>
            <option value="vazamento">Vazamento</option>
            <option value="falta-agua">Falta d'água</option>
            <option value="religacao">Religação</option>
          </select>
        </div>

        <div className="campo">
          <label htmlFor="nova-municipio">Município</label>
          <select
            id="nova-municipio"
            value={municipio}
            onChange={(evento) => setMunicipio(evento.target.value)}
          >
            <option value="">Selecione o município</option>
            {municipios.map((nome) => (
              <option key={nome} value={nome}>{nome}</option>
            ))}
          </select>
        </div>

        {tipo === "falta-agua" && (
          <div className="opcao campo-inteiro">
            <input
              type="checkbox"
              id="nova-rua-toda"
              checked={ruaToda}
              onChange={(evento) => mudarRuaToda(evento.target.checked)}
            />
            <label htmlFor="nova-rua-toda">Falta d'água na rua toda, não só no imóvel</label>
          </div>
        )}

        <div className="campo">
          <label htmlFor="nova-bairro">Bairro</label>
          <input
            type="text"
            id="nova-bairro"
            value={bairro}
            onChange={(evento) => setBairro(evento.target.value)}
          />
        </div>

        <fieldset className="campo">
          <legend>Prioridade</legend>
          <div className="opcoes">
            <div className="opcao">
              <input
                type="radio"
                id="nova-baixa"
                name="nova-prioridade"
                checked={prioridade === "baixa"}
                disabled={ruaToda}
                onChange={() => setPrioridade("baixa")}
              />
              <label htmlFor="nova-baixa">Baixa</label>
            </div>
            <div className="opcao">
              <input
                type="radio"
                id="nova-media"
                name="nova-prioridade"
                checked={prioridade === "media"}
                disabled={ruaToda}
                onChange={() => setPrioridade("media")}
              />
              <label htmlFor="nova-media">Média</label>
            </div>
            <div className="opcao">
              <input
                type="radio"
                id="nova-alta"
                name="nova-prioridade"
                checked={prioridade === "alta"}
                onChange={() => setPrioridade("alta")}
              />
              <label htmlFor="nova-alta">Alta</label>
            </div>
          </div>
        </fieldset>

        <div className="campo campo-inteiro">
          <label htmlFor="nova-relato">O que o cliente relatou</label>
          <textarea
            id="nova-relato"
            rows={4}
            maxLength={LIMITE_RELATO}
            value={relato}
            onChange={(evento) => setRelato(evento.target.value)}
          />
          <p className={relato.length >= 450 ? "contador contador-alerta" : "contador"}>
            {relato.length} de {LIMITE_RELATO} caracteres
          </p>
        </div>
      </div>

      <button type="submit" disabled={!podeRegistrar}>Registrar solicitação</button>
    </form>
  );
}
