import { useEffect, useState } from "react";
import { DicasAtendimento, TentativasDeContato } from "../atendimento";
import { Aviso } from "../../shared/ui/Aviso";
import { Cartao } from "../../shared/ui/Cartao";
import { MensagemDeErro } from "../../shared/ui/MensagemDeErro";
import { FiltrosSolicitacoes } from "./components/FiltrosSolicitacoes";
import { FormularioSolicitacao } from "./components/FormularioSolicitacao";
import { TabelaSolicitacoes } from "./components/TabelaSolicitacoes";
import { listarSolicitacoes, registrarSolicitacao } from "./api";
import { DetalheSolicitacao } from "./DetalheSolicitacao";
import type { ErrosDosCampos } from "./api";
import { nomesDosStatus } from "./nomes";
import { ehUrgente, filtrarSolicitacoes } from "./regras";
import type { Filtros } from "./regras";
import type { NovaSolicitacao, Solicitacao } from "./tipos";

const FILTROS_INICIAIS: Filtros = { prioridade: "todas", busca: "" };

// Em que pé está o carregamento da lista: um valor só, nunca dois ao mesmo tempo
type Situacao = "carregando" | "erro" | "pronto";

// A página: guarda o estado da tela e compõe os componentes.
// As regras vêm de regras.ts; a apresentação, dos componentes.
export function PaginaSolicitacoes() {
  const [lista, setLista] = useState<Solicitacao[]>([]);
  const [situacao, setSituacao] = useState<Situacao>("carregando");
  const [tentativa, setTentativa] = useState(0);
  const [aviso, setAviso] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [errosDoFormulario, setErrosDoFormulario] = useState<ErrosDosCampos>({});
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIAIS);
  const [selecionada, setSelecionada] = useState<string | null>(null);

  const visiveis = filtrarSolicitacoes(lista, filtros);
  const urgentes = visiveis.filter(ehUrgente);
  const totalUrgentes = lista.filter(ehUrgente).length;

  // Envia para a API. Devolve true se registrou, para o formulário saber se limpa os campos.
  async function registrar(nova: NovaSolicitacao): Promise<boolean> {
    setEnviando(true);
    setErrosDoFormulario({});
    try {
      const resultado = await registrarSolicitacao(nova);
      if (resultado.tipo === "recusada") {
        setErrosDoFormulario(resultado.campos);
        return false;
      }
      const registrada = resultado.solicitacao;
      // Depois de um await, a lista pode ter mudado: a função recebe a lista atual
      setLista((atual) => [registrada, ...atual]);
      setAviso(`Solicitação ${registrada.numero} registrada.`);
      return true;
    } catch (erro) {
      console.error(erro);
      setErrosDoFormulario({ geral: "Não foi possível registrar agora. Tente de novo em instantes." });
      return false;
    } finally {
      setEnviando(false);
    }
  }

  // O painel avisa que a solicitação mudou: a lista troca só aquela, sem buscar tudo de novo
  function aoAlterar(alterada: Solicitacao) {
    setLista((atual) => atual.map((s) => (s.numero === alterada.numero ? alterada : s)));
    setAviso(`Solicitação ${alterada.numero}: ${nomesDosStatus[alterada.status].toLowerCase()}.`);
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

  // O aviso some sozinho depois de 5 segundos. Um aviso novo reinicia a contagem.
  useEffect(() => {
    if (aviso === "") return;
    const relogio = setTimeout(() => setAviso(""), 5000);
    return () => clearTimeout(relogio);
  }, [aviso]);

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

  return (
    <>
      <h1>Solicitações de serviço</h1>
      <p>Pedidos registrados pelo atendimento: vazamentos, falta d'água e religações.</p>

      <Cartao titulo="Dicas para registrar uma solicitação">
        <DicasAtendimento />
      </Cartao>

      <Cartao titulo="Nova solicitação">
        <FormularioSolicitacao
          aoRegistrar={registrar}
          erros={errosDoFormulario}
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

        {/* key: outro número, outro painel, com o estado zerado */}
        {selecionada && (
          <DetalheSolicitacao
            key={selecionada}
            numero={selecionada}
            aoFechar={() => setSelecionada(null)}
            aoAlterar={aoAlterar}
          />
        )}
      </div>

      {situacao === "pronto" && (
        <Cartao titulo="Retorno ao cliente">
          <p>Antes de enviar a equipe, o atendimento liga para confirmar o endereço. Aparecem aqui as urgentes da tabela: prioridade alta e ainda não resolvidas.</p>
          {urgentes.length === 0 ? (
            <p className="vazio" role="status">Nenhuma solicitação urgente com os filtros atuais.</p>
          ) : (
            urgentes.map((solicitacao) => (
              <TentativasDeContato key={solicitacao.numero} numero={solicitacao.numero} />
            ))
          )}
        </Cartao>
      )}

      {/* A região existe sempre, para o leitor de tela anunciar quando o aviso aparecer */}
      <div className="avisos" role="status">
        {aviso && <Aviso texto={aviso} aoFechar={() => setAviso("")} />}
      </div>
    </>
  );
}
