import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { DicasAtendimento, TentativasDeContato } from "../atendimento";
import { useAviso } from "../../shared/hooks/useAviso";
import { useCarregar } from "../../shared/hooks/useCarregar";
import { Aviso } from "../../shared/ui/Aviso";
import { Carregamento } from "../../shared/ui/Carregamento";
import { Cartao } from "../../shared/ui/Cartao";
import { Paginacao } from "../../shared/ui/Paginacao";
import { FiltrosSolicitacoes } from "./components/FiltrosSolicitacoes";
import { FormularioSolicitacao } from "./components/FormularioSolicitacao";
import { TabelaSolicitacoes } from "./components/TabelaSolicitacoes";
import { listarSolicitacoes, POR_PAGINA, registrarSolicitacao } from "./api";
import { DetalheSolicitacao } from "./DetalheSolicitacao";
import type { ErrosDosCampos } from "./api";
import { nomesDosStatus } from "./nomes";
import { ehUrgente } from "./regras";
import type { Filtros } from "./regras";
import type { NovaSolicitacao, Solicitacao } from "./tipos";

const FILTROS_INICIAIS: Filtros = { prioridade: "todas", busca: "" };

// A página: guarda o estado da tela e compõe os componentes.
// As regras vêm de regras.ts; a apresentação, dos componentes.
export function PaginaSolicitacoes() {
  const [pagina, setPagina] = useState(1);
  const [aviso, setAviso] = useAviso();
  const [enviando, setEnviando] = useState(false);
  const [errosDoFormulario, setErrosDoFormulario] = useState<ErrosDosCampos>({});
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIAIS);

  // A solicitação aberta vem do endereço: /solicitacoes/26-08815
  const { numero } = useParams();
  const selecionada = numero ?? null;
  const navigate = useNavigate();

  // A consulta vira a chave: mudou um filtro ou a página, o hook busca de novo
  const consulta = { ...filtros, pagina };
  const solicitacoes = useCarregar(JSON.stringify(consulta), () => listarSolicitacoes(consulta));
  const lista = solicitacoes.dados?.itens ?? [];
  const total = solicitacoes.dados?.total ?? 0;

  // A lista já vem filtrada da API: as urgentes são as desta página
  const urgentes = lista.filter(ehUrgente);
  const totalDePaginas = Math.ceil(total / POR_PAGINA);

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
      // A nova é a mais recente: volta para a página 1, busca de novo e abre o painel dela
      setPagina(1);
      solicitacoes.recarregar();
      setAviso(`Solicitação ${registrada.numero} registrada.`);
      navigate(`/solicitacoes/${registrada.numero}`);
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
    solicitacoes.setDados((atual) =>
      atual && { ...atual, itens: atual.itens.map((s) => (s.numero === alterada.numero ? alterada : s)) },
    );
    setAviso(`Solicitação ${alterada.numero}: ${nomesDosStatus[alterada.status].toLowerCase()}.`);
  }

  // Filtro novo, resultado novo: volta para a página 1
  function mudarFiltros(novos: Filtros) {
    setFiltros(novos);
    setPagina(1);
  }

  // Título da aba com o número de urgentes desta página
  useEffect(() => {
    document.title = `(${urgentes.length}) Central de Solicitações`;
  }, [urgentes.length]);

  // Esc limpa os filtros, de qualquer lugar da página
  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        setFiltros(FILTROS_INICIAIS);
        setPagina(1);
      }
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
          <Carregamento
            situacao={solicitacoes.situacao}
            carregando="Carregando as solicitações…"
            erro="Não foi possível carregar as solicitações."
            aoTentarDeNovo={solicitacoes.tentarDeNovo}
          >
            <FiltrosSolicitacoes filtros={filtros} aoMudar={mudarFiltros} />
            <TabelaSolicitacoes
              solicitacoes={lista}
              total={total}
              selecionada={selecionada}
            />
            <Paginacao pagina={pagina} totalDePaginas={totalDePaginas} aoMudar={setPagina} />
          </Carregamento>
        </Cartao>

        {/* key: outro número, outro painel, com o estado zerado */}
        {selecionada && (
          <DetalheSolicitacao
            key={selecionada}
            numero={selecionada}
            aoAlterar={aoAlterar}
          />
        )}
      </div>

      {solicitacoes.situacao === "pronto" && (
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
