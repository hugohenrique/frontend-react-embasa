import { useEffect, useState } from "react";
import { Aviso } from "../../shared/ui/Aviso";
import { Carregamento } from "../../shared/ui/Carregamento";
import type { Situacao } from "../../shared/ui/Carregamento";
import { Cartao } from "../../shared/ui/Cartao";
import { Paginacao } from "../../shared/ui/Paginacao";
import { criarOrdem, listarEquipes, listarOrdens, mudarStatusDaOrdem, POR_PAGINA } from "./api";
import type { ErrosDosCampos, FiltroStatusOrdem } from "./api";
import { AcoesOrdem } from "./components/AcoesOrdem";
import { FormularioOrdem } from "./components/FormularioOrdem";
import { TabelaOrdens } from "./components/TabelaOrdens";
import { nomesDosStatusDaOrdem } from "./nomes";
import type { Equipe, NovaOrdem, OrdemDeServico, StatusOrdem } from "./tipos";

// A página das ordens de serviço: guarda o estado e conversa com a API pelo api.ts
export function PaginaOrdens() {
  const [lista, setLista] = useState<OrdemDeServico[]>([]);
  const [total, setTotal] = useState(0);
  const [situacao, setSituacao] = useState<Situacao>("carregando");
  const [tentativa, setTentativa] = useState(0);
  const [status, setStatus] = useState<FiltroStatusOrdem>("todos");
  const [pagina, setPagina] = useState(1);
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [erros, setErros] = useState<ErrosDosCampos>({});
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState("");
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [erroDaAcao, setErroDaAcao] = useState("");

  // A ordem selecionada é procurada na página atual; se sumir da página, as ações fecham
  const ordemSelecionada = lista.find((ordem) => ordem.numero === selecionada) ?? null;

  // As equipes vêm da API uma vez, quando a página aparece
  useEffect(() => {
    let ignorar = false;
    listarEquipes()
      .then((dados) => {
        if (!ignorar) setEquipes(dados);
      })
      .catch((erro) => {
        console.error(erro);
        if (!ignorar) setErros({ geral: "Não foi possível carregar as equipes. Recarregue a página." });
      });
    return () => {
      ignorar = true;
    };
  }, []);

  // O aviso some sozinho depois de 5 segundos
  useEffect(() => {
    if (aviso === "") return;
    const relogio = setTimeout(() => setAviso(""), 5000);
    return () => clearTimeout(relogio);
  }, [aviso]);

  // O mesmo carregamento de solicitações: ignorar, tentativa e três situações
  useEffect(() => {
    let ignorar = false;

    async function carregar() {
      try {
        const resposta = await listarOrdens({ status, pagina });
        if (ignorar) return;
        setLista(resposta.itens);
        setTotal(resposta.total);
        setSituacao("pronto");
      } catch (erro) {
        if (ignorar) return;
        console.error(erro);
        setSituacao("erro");
      }
    }

    carregar();
    return () => {
      ignorar = true;
    };
  }, [status, pagina, tentativa]);

  // Envia para a API. Devolve true se criou, para o formulário saber se limpa os campos.
  async function criar(nova: NovaOrdem): Promise<boolean> {
    setEnviando(true);
    setErros({});
    try {
      const resultado = await criarOrdem(nova);
      if (resultado.tipo === "recusada") {
        setErros(resultado.campos);
        return false;
      }
      if (resultado.tipo === "conflito") {
        setErros({ solicitacao: resultado.mensagem });
        return false;
      }
      setAviso(`${resultado.ordem.numero} criada para a ${resultado.ordem.nomeEquipe}.`);
      // A nova é a mais recente: mostra todas, a partir da página 1
      setStatus("todos");
      setPagina(1);
      setTentativa((atual) => atual + 1);
      return true;
    } catch (erro) {
      console.error(erro);
      setErros({ geral: "Não foi possível criar a ordem agora. Tente de novo em instantes." });
      return false;
    } finally {
      setEnviando(false);
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
        setTentativa((atual) => atual + 1);
      } else {
        const alterada = resultado.ordem;
        setLista((atual) => atual.map((o) => (o.numero === alterada.numero ? alterada : o)));
        setAviso(`${alterada.numero}: ${nomesDosStatusDaOrdem[alterada.status].toLowerCase()}.`);
      }
    } catch (erro) {
      console.error(erro);
      setErroDaAcao("Não foi possível salvar agora. Tente de novo em instantes.");
    } finally {
      setSalvando(false);
    }
  }

  // Filtro novo, resultado novo: volta para a página 1 (a lição do exercício de ontem)
  function mudarStatus(novo: FiltroStatusOrdem) {
    setStatus(novo);
    setPagina(1);
  }

  function tentarDeNovo() {
    setSituacao("carregando");
    setTentativa(tentativa + 1);
  }

  return (
    <>
      <h1>Ordens de serviço</h1>
      <Cartao titulo="Nova ordem de serviço">
        <p>Para uma solicitação em atendimento. A API confere a solicitação, a equipe e a data.</p>
        <FormularioOrdem equipes={equipes} erros={erros} enviando={enviando} aoCriar={criar} />
      </Cartao>

      <Cartao titulo="Ordens de serviço de campo">
        <Carregamento
          situacao={situacao}
          carregando="Carregando as ordens…"
          erro="Não foi possível carregar as ordens."
          aoTentarDeNovo={tentarDeNovo}
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
          <Paginacao pagina={pagina} totalDePaginas={Math.ceil(total / POR_PAGINA)} aoMudar={setPagina} />
        </Carregamento>
      </Cartao>

      <div className="avisos" role="status">
        {aviso && <Aviso texto={aviso} aoFechar={() => setAviso("")} />}
      </div>
    </>
  );
}
