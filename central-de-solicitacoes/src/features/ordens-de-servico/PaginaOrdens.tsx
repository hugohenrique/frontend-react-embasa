import { useState } from "react";
import { useSearchParams } from "react-router";
import { useMostrarAviso } from "../../shared/avisos/useMostrarAviso";
import { useCarregar } from "../../shared/hooks/useCarregar";
import { Carregamento } from "../../shared/ui/Carregamento";
import { Cartao } from "../../shared/ui/Cartao";
import { MensagemDeErro } from "../../shared/ui/MensagemDeErro";
import { Paginacao } from "../../shared/ui/Paginacao";
import { criarOrdem, listarEquipes, listarOrdens, mudarStatusDaOrdem, POR_PAGINA } from "./api";
import type { ErrosDosCampos, FiltroStatusOrdem } from "./api";
import { AcoesOrdem } from "./components/AcoesOrdem";
import { FormularioOrdem } from "./components/FormularioOrdem";
import { TabelaOrdens } from "./components/TabelaOrdens";
import { nomesDosStatusDaOrdem } from "./nomes";
import { lerFiltroStatus } from "./regras";
import type { NovaOrdem, StatusOrdem } from "./tipos";

// A página das ordens de serviço: guarda o estado e conversa com a API pelo api.ts
export function PaginaOrdens() {
  // O filtro e a página moram no endereço: /ordens?status=programada&pagina=2
  const [parametros, setParametros] = useSearchParams();
  const status = lerFiltroStatus(parametros.get("status"));
  // O que não for um inteiro positivo vira a página 1
  const numeroPagina = Number(parametros.get("pagina"));
  const pagina = Number.isInteger(numeroPagina) && numeroPagina >= 1 ? numeroPagina : 1;
  const mostrarAviso = useMostrarAviso();
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [erroDaAcao, setErroDaAcao] = useState("");

  // A consulta vira a chave: mudou o status ou a página, o hook busca de novo
  const consulta = { status, pagina };
  const ordens = useCarregar(JSON.stringify(consulta), () => listarOrdens(consulta));
  const equipes = useCarregar("equipes", listarEquipes);

  const lista = ordens.dados?.itens ?? [];
  const total = ordens.dados?.total ?? 0;

  // A ordem selecionada é procurada na página atual; se sumir da página, as ações fecham
  const ordemSelecionada = lista.find((ordem) => ordem.numero === selecionada) ?? null;

  async function criar(nova: NovaOrdem): Promise<ErrosDosCampos> {
    try {
      const resultado = await criarOrdem(nova);
      if (resultado.tipo === "recusada") {
        return resultado.campos;
      }
      if (resultado.tipo === "conflito") {
        return {
          solicitacao: resultado.mensagem
        };
      }
      mostrarAviso(`${resultado.ordem.numero} criada para a ${resultado.ordem.nomeEquipe}.`);
      // A nova é a mais recente: endereço limpo mostra todas, a partir da página 1
      setParametros(new URLSearchParams());
      ordens.recarregar();
      return {};
    } catch (erro) {
      console.error(erro);
      return { geral: "Não foi possível criar a ordem agora. Tente de novo em instantes." };
    }
  }

  function selecionar(numero: string) {
    setSelecionada(numero);
    setErroDaAcao("");
  }

  // Pede a mudança à API e mostra o que ela respondeu
  async function mudar(status: StatusOrdem, observacao: string) {
    if (!ordemSelecionada) return;
    setSalvando(true);
    setErroDaAcao("");
    try {
      const resultado = await mudarStatusDaOrdem(ordemSelecionada.numero, status, observacao);
      if (resultado.tipo === "recusada") {
        setErroDaAcao(Object.values(resultado.campos).join(" "));
      } else if (resultado.tipo === "conflito") {
        // A tela estava velha: mostra o aviso e busca a página de novo
        setErroDaAcao(resultado.mensagem);
        ordens.recarregar();
      } else {
        const alterada = resultado.ordem;
        // Troca só a ordem alterada, dentro da página que já está na tela
        ordens.setDados((atual) =>
          atual && { ...atual, itens: atual.itens.map((o) => (o.numero === alterada.numero ? alterada : o)) },
        );
        mostrarAviso(`${alterada.numero}: ${nomesDosStatusDaOrdem[alterada.status].toLowerCase()}.`);
      }
    } catch (erro) {
      console.error(erro);
      setErroDaAcao("Não foi possível salvar agora. Tente de novo em instantes.");
    } finally {
      setSalvando(false);
    }
  }

  // Filtro novo: um endereço novo, só com o status. Sem pagina no endereço, é a página 1.
  function mudarStatus(novo: FiltroStatusOrdem) {
    const novos = new URLSearchParams();
    if (novo !== "todos") novos.set("status", novo);
    setParametros(novos);
  }

  // Outra página: mantém o que está no endereço e troca só a página
  function irParaPagina(novaPagina: number) {
    const novos = new URLSearchParams(parametros);
    novos.set("pagina", String(novaPagina));
    setParametros(novos);
  }

  return (
    <>
      <h1>Ordens de serviço</h1>
      <Cartao titulo="Nova ordem de serviço">
        <p>Para uma solicitação em atendimento. A API confere a solicitação, a equipe e a data.</p>
        {equipes.situacao === "erro" && (
          <MensagemDeErro texto="Não foi possível carregar as equipes." aoTentarDeNovo={equipes.tentarDeNovo} />
        )}
        <FormularioOrdem equipes={equipes.dados ?? []} aoCriar={criar} />
      </Cartao>

      <Cartao titulo="Ordens de serviço de campo">
        <Carregamento
          situacao={ordens.situacao}
          carregando="Carregando as ordens…"
          erro="Não foi possível carregar as ordens."
          aoTentarDeNovo={ordens.tentarDeNovo}
        >
          <div className="filtros">
            <div>
              <label htmlFor="filtro-status-ordem">Status</label>
              <select
                id="filtro-status-ordem"
                value={status}
                onChange={(evento) => mudarStatus(evento.target.value as FiltroStatusOrdem)}
              >
                <option value="todos">Todos</option>
                <option value="programada">Programada</option>
                <option value="em-execucao">Em execução</option>
                <option value="impedida">Impedida</option>
                <option value="concluida">Concluída</option>
              </select>
            </div>
          </div>
          {ordemSelecionada && (
            <AcoesOrdem
              key={ordemSelecionada.numero + ordemSelecionada.status}
              ordem={ordemSelecionada}
              salvando={salvando}
              erro={erroDaAcao}
              aoMudar={mudar}
              aoFechar={() => setSelecionada(null)}
            />
          )}
          <TabelaOrdens
            ordens={lista}
            total={total}
            selecionada={selecionada}
            aoSelecionar={selecionar}
          />
          <Paginacao pagina={pagina} totalDePaginas={Math.ceil(total / POR_PAGINA)} aoMudar={irParaPagina} />
        </Carregamento>
      </Cartao>
    </>
  );
}
