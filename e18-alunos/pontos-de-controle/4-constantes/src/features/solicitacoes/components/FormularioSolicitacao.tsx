import { useState } from "react";
import type { FormEvent } from "react";
import type { ErrosCampos } from "../api";
import { Prioridade, TipoServico } from "../constantes";
import { nomesTipos } from "../nomes";
import type { NovaSolicitacao } from "../tipos";

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

type FormularioSolicitacaoProps = {
  aoRegistrar: (nova: NovaSolicitacao) => Promise<boolean>;
  erros: ErrosCampos;
  estaEnviando: boolean;
};

export function FormularioSolicitacao({ aoRegistrar, erros, estaEnviando }: FormularioSolicitacaoProps) {
  const [tipo, setTipo] = useState<TipoServico | "">("");
  const [ehRuaToda, setEhRuaToda] = useState(false);
  const [municipio, setMunicipio] = useState("");
  const [bairro, setBairro] = useState("");
  const [prioridade, setPrioridade] = useState<Prioridade | "">("");
  const [relato, setRelato] = useState("");

  // O botão só fica ativo com os campos obrigatórios preenchidos
  const podeRegistrar =
    tipo !== "" && municipio !== "" && bairro.trim() !== "" && prioridade !== "";

  function mudarTipo(novoTipo: TipoServico | "") {
    setTipo(novoTipo);
    if (novoTipo !== TipoServico.FALTA_AGUA) setEhRuaToda(false);
  }

  // Regra de exemplo do curso: falta d'água na rua toda é prioridade alta
  function mudarRuaToda(marcado: boolean) {
    setEhRuaToda(marcado);
    if (marcado) setPrioridade(Prioridade.ALTA);
  }

  async function registrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (tipo === "" || prioridade === "") return;

    const registrou = await aoRegistrar({ tipo, municipio, bairro: bairro.trim(), prioridade, relato });
    if (!registrou) return;

    // Só limpa o formulário se a API registrou
    setTipo("");
    setEhRuaToda(false);
    setMunicipio("");
    setBairro("");
    setPrioridade("");
    setRelato("");
  }

  return (
    <form onSubmit={registrar}>
      {erros.geral && <p className="erro-carregamento" role="alert">{erros.geral}</p>}
      <div className="campos">
        <div className="campo">
          <label htmlFor="nova-tipo">Tipo de serviço</label>
          <select
            id="nova-tipo"
            value={tipo}
            onChange={(evento) => mudarTipo(evento.target.value as TipoServico | "")}
          >
            <option value="">Selecione o tipo</option>
            {/* A lista sai da constante: um tipo novo aparece aqui sem mexer no formulário */}
            {Object.values(TipoServico).map((valor) => (
              <option key={valor} value={valor}>{nomesTipos[valor]}</option>
            ))}
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

        {tipo === TipoServico.FALTA_AGUA && (
          <div className="opcao campo-inteiro">
            <input
              type="checkbox"
              id="nova-rua-toda"
              checked={ehRuaToda}
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
            aria-invalid={erros.bairro ? true : undefined}
            aria-describedby={erros.bairro ? "nova-bairro-erro" : undefined}
          />
          {erros.bairro && <p className="erro-campo" id="nova-bairro-erro">{erros.bairro}</p>}
        </div>

        <fieldset className="campo">
          <legend>Prioridade</legend>
          <div className="opcoes">
            <div className="opcao">
              <input
                type="radio"
                id="nova-baixa"
                name="nova-prioridade"
                checked={prioridade === Prioridade.BAIXA}
                disabled={ehRuaToda}
                onChange={() => setPrioridade(Prioridade.BAIXA)}
              />
              <label htmlFor="nova-baixa">Baixa</label>
            </div>
            <div className="opcao">
              <input
                type="radio"
                id="nova-media"
                name="nova-prioridade"
                checked={prioridade === Prioridade.MEDIA}
                disabled={ehRuaToda}
                onChange={() => setPrioridade(Prioridade.MEDIA)}
              />
              <label htmlFor="nova-media">Média</label>
            </div>
            <div className="opcao">
              <input
                type="radio"
                id="nova-alta"
                name="nova-prioridade"
                checked={prioridade === Prioridade.ALTA}
                onChange={() => setPrioridade(Prioridade.ALTA)}
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
            aria-invalid={erros.relato ? true : undefined}
            aria-describedby={erros.relato ? "nova-relato-erro" : undefined}
          />
          {erros.relato && <p className="erro-campo" id="nova-relato-erro">{erros.relato}</p>}
          <p className={relato.length >= 450 ? "contador contador-alerta" : "contador"}>
            {relato.length} de {LIMITE_RELATO} caracteres
          </p>
        </div>
      </div>

      <button type="submit" disabled={!podeRegistrar || estaEnviando}>
        {estaEnviando ? "Registrando…" : "Registrar solicitação"}
      </button>
    </form>
  );
}
