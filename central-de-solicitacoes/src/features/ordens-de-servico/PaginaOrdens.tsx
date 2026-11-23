import { useEffect, useState } from "react";
import { Cartao } from "../../shared/ui/Cartao";
import { MensagemDeErro } from "../../shared/ui/MensagemDeErro";
import { Paginacao } from "../../shared/ui/Paginacao";
import { criarOrdem, listarEquipes, listarOrdens, mudarStatusDaOrdem, POR_PAGINA } from "./api";
import type { ErrosDosCampos, FiltroStatusOrdem } from "./api";
import { TabelaOrdens } from "./components/TabelaOrdens";
import type { Equipe, NovaOrdem, OrdemDeServico, StatusOrdem } from "./tipos";
import { FormularioOrdem } from "./components/FormularioOrdem";
import { Aviso } from "../../shared/ui/Aviso";
import { nomesDosStatusDaOrdem } from "./nomes";
import { AcoesOrdem } from "./components/AcoesOrdem";

type Situacao = "carregando" | "erro" | "pronto";

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

  const ordemSelecionada = lista.find((ordem) => ordem.numero === selecionada) ?? null;

  useEffect(() => {
    let ignorar = false;

    listarEquipes().then((dados) => {
      if (!ignorar) {
        setEquipes(dados);
      }
    }).catch((erro) => {
      console.log(erro);
      if (!ignorar) {
        setErros({ geral: "Não foi possível carregar as equipes. Recarregue a página" });
      }
    });

    async function carregar() {
      try {
        const resposta = await listarOrdens({ status, pagina });
        if (ignorar) {
          return;
        }
        setLista(resposta.itens);
        setTotal(resposta.total);
        setSituacao("pronto");
      } catch (erro) {
        if (ignorar) {
          return;
        }
        console.error(erro);
        setSituacao("erro");
      }
    }

    carregar();
    return () => {
      ignorar = true;
    };
  }, [status, pagina, tentativa]);

  // Filtro novo, resultado novo: volta para a página 1 (a lição do exercício de ontem)
  function mudarStatus(novo: FiltroStatusOrdem) {
    setStatus(novo);
    setPagina(1);
  }

  function tentarDeNovo() {
    setSituacao("carregando");
    setTentativa(tentativa + 1);
  }

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

  async function mudar(status: StatusOrdem, observacao: string) {
    if (!ordemSelecionada) {
      return;
    }
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

  function selecionar(numero: string) {
    setSelecionada(numero);
    setErroDaAcao("");
  }

  return (
    <>
      <h1>Ordens de serviço</h1>
      <Cartao titulo="Nova ordem de serviço">
        <p>Para uma solição em atendimento. A API confere a solicitação, equipe e data.</p>
        <FormularioOrdem
          equipes={equipes}
          enviando={enviando}
          erros={erros}
          aoCriar={criar}
        />
      </Cartao>
      <Cartao titulo="Ordens de serviço de campo">
        {situacao === "carregando" && <p className="vazio" role="status">Carregando as ordens…</p>}
        {situacao === "erro" && (
          <MensagemDeErro texto="Não foi possível carregar as ordens." aoTentarDeNovo={tentarDeNovo} />
        )}
        {situacao === "pronto" && (
          <>
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
          </>
        )}
      </Cartao>
      <div className="avisos" role="status">
        {aviso && <Aviso texto={aviso} aoFechar={() => setAviso("")}/>}
      </div>
    </>
  );
}
