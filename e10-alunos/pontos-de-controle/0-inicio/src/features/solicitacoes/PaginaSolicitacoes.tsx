import { useEffect, useState } from "react";
import { DicasAtendimento, TentativasDeContato } from "../atendimento";
import { hojeISO } from "../../shared/datas";
import { Cartao } from "../../shared/ui/Cartao";
import { FiltrosSolicitacoes } from "./components/FiltrosSolicitacoes";
import { FormularioSolicitacao } from "./components/FormularioSolicitacao";
import { TabelaSolicitacoes } from "./components/TabelaSolicitacoes";
import { solicitacoes } from "./dados";
import { completarSolicitacao, ehUrgente, filtrarSolicitacoes } from "./regras";
import type { Filtros } from "./regras";
import type { NovaSolicitacao, Solicitacao } from "./tipos";

const FILTROS_INICIAIS: Filtros = { prioridade: "todas", busca: "" };

// A página: guarda o estado da tela e compõe os componentes.
// As regras vêm de regras.ts; a apresentação, dos componentes.
export function PaginaSolicitacoes() {
  const [lista, setLista] = useState<Solicitacao[]>(solicitacoes);
  const [mensagem, setMensagem] = useState("");
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIAIS);

  const visiveis = filtrarSolicitacoes(lista, filtros);
  const urgentes = visiveis.filter(ehUrgente);
  const totalUrgentes = lista.filter(ehUrgente).length;

  function registrar(nova: NovaSolicitacao) {
    const completa = completarSolicitacao(nova, lista, hojeISO());
    setLista([completa, ...lista]);
    setMensagem(`Solicitação ${completa.numero} registrada.`);
  }

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
        <FormularioSolicitacao aoRegistrar={registrar} />
        <p className="mensagem" role="status">{mensagem}</p>
      </Cartao>

      <Cartao titulo="Solicitações recentes">
        <FiltrosSolicitacoes filtros={filtros} aoMudar={setFiltros} />
        <TabelaSolicitacoes solicitacoes={visiveis} total={lista.length} />
      </Cartao>

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
    </>
  );
}
