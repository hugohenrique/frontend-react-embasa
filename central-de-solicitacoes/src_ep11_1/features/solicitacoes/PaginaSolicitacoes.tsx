import { useEffect, useState } from "react";
import { DicasAtendimento, TentativasDeContato } from "../atendimento";
import { Cartao } from "../../shared/ui/Cartao";
import { MensagemDeErro } from "../../shared/ui/MensagemDeErro";
import { FiltrosSolicitacoes } from "./components/FiltrosSolicitacoes";
import { FormularioSolicitacao } from "./components/FormularioSolicitacao";
import { TabelaSolicitacoes } from "./components/TabelaSolicitacoes";
import { listarSolicitacoes, registrarSolicitacao, type ErrosCampos } from "./api";
import { ehUrgente, filtrarSolicitacoes } from "./regras";
import type { Filtros } from "./regras";
import type { NovaSolicitacao, Solicitacao } from "./tipos";
import { Aviso } from "../../shared/ui/Aviso";
import { DetalheSolicitacao } from "./DetalheSolicitacao";

const FILTROS_INICIAIS: Filtros = { prioridade: "todas", busca: "" };

// Em que pé está o carregamento da lista: um valor só, nunca dois ao mesmo tempo
type Situacao = "carregando" | "erro" | "pronto";

// A página: guarda o estado da tela e compõe os componentes.
// As regras vêm de regras.ts; a apresentação, dos componentes.
export function PaginaSolicitacoes() {
  const [lista, setLista] = useState<Solicitacao[]>([]);
  const [situacao, setSituacao] = useState<Situacao>("carregando");
  const [tentativa, setTentativa] = useState(0);
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIAIS);
  const [errosFormulario, setErrosFormulario] = useState<ErrosCampos>({});
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState("");
  const [selecionada, setSelecionada] = useState<string | null>(null);

  const visiveis = filtrarSolicitacoes(lista, filtros);
  const urgentes = visiveis.filter(ehUrgente);
  const totalUrgentes = lista.filter(ehUrgente).length;

  async function registrar(nova: NovaSolicitacao): Promise<boolean> {
    setEnviando(true);
    setErrosFormulario({});

    try {
      const resultado = await registrarSolicitacao(nova);
      if (resultado.tipo === "recusada") {
        setErrosFormulario(resultado.campos);
        return false;
      }
      const registrada = resultado.solicitacao;
      setLista((atual) => [registrada, ...atual]);
      setAviso(`Solicitação ${registrada.numero} registrada.`);
      return true;
    } catch (erro) {
      console.log(erro);
      setErrosFormulario({ geral: "Não foi possível registrar agora, tente novamente mais tarde." });
      return false;
    } finally {
      setEnviando(false);
    }
  }

  // Cada clique muda a tentativa, e o efeito de carregar roda de novo
  function tentarDeNovo() {
    setSituacao("carregando");
    setTentativa(tentativa + 1);
  }

  // Carrega a lista da API quando a página aparece, e a cada nova tentativa
  useEffect(() => {
    let ignorar = false;

    async function carregar() {
      try {
        const itens = await listarSolicitacoes();
        if (ignorar) return;
        setLista(itens);
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
  }, [tentativa]);

  // Título da aba com o número de urgentes
  useEffect(() => {
    document.title = `(${totalUrgentes}) Central de Solicitações`;
  }, [totalUrgentes]);

  // Esc limpa os filtros, de qualquer lugar da página
  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === "Escape") setFiltros(FILTROS_INICIAIS);
    }
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, []);

  useEffect(() => {
    if (aviso === "") {
      return;
    }
    const relogio = setTimeout(() => {
      setAviso("");
    }, 5000);
    return () => clearTimeout(relogio);
  }, [aviso]);

  return (
    <>
      <h1>Solicitações de serviço</h1>
      <p>Pedidos registrados pelo atendimento: vazamentos, falta d'água e religações.</p>

      <Cartao titulo="Dicas para registrar uma solicitação">
        <DicasAtendimento />
      </Cartao>

      <Cartao titulo="Nova solicitação">
        <div className="avisos" role="status">
          {aviso && <Aviso texto={aviso} aoFechar={() => setAviso("")} />}
        </div>
        <FormularioSolicitacao
          aoRegistrar={registrar}
          erros={errosFormulario}
          enviando={enviando}
        />
      </Cartao>

      <div className={selecionada ? "mestre-detalhe com-detalhe" : "mestre-detalhe"}>
        <Cartao titulo="Solicitações recentes">
          {situacao === "carregando" && (
            <p className="vazio" role="status">Carregando as solicitações…</p>
          )}
          {situacao === "erro" && (
            <MensagemDeErro
              texto="Não foi possível carregar as solicitações."
              aoTentarDeNovo={tentarDeNovo}
            />
          )}
          {situacao === "pronto" && (
            <>
              <FiltrosSolicitacoes filtros={filtros} aoMudar={setFiltros} />
              <TabelaSolicitacoes
                solicitacoes={visiveis}
                total={lista.length}
                selecionada={selecionada}
                aoAbrir={setSelecionada}
              />
            </>
          )}
        </Cartao>
        {selecionada && (
          <DetalheSolicitacao
            key={selecionada}
            numero={selecionada}
            aoFechar={() => setSelecionada(null)}
          />
        )}
      </div>

      {situacao === "pronto" && (
        <Cartao titulo="Retorno ao cliente">
          <p>Antes de enviar a equipe, o atendimento liga para confirmar o endereço. Aparecem aqui as de prioridade alta que estão na tabela.</p>
          {urgentes.length === 0 ? (
            <p className="vazio" role="status">Nenhuma solicitação de prioridade alta com os filtros atuais.</p>
          ) : (
            urgentes.map((solicitacao) => (
              <TentativasDeContato key={solicitacao.numero} numero={solicitacao.numero} />
            ))
          )}
        </Cartao>
      )}
    </>
  );
}
