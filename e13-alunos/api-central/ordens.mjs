// Ordens de serviço: o trabalho que uma equipe de campo executa para resolver uma solicitação.
// Módulo fictício, criado para o curso. NÃO descreve como a Embasa organiza as equipes.

export const EQUIPES = [
  { id: "E01", nome: "Equipe 01", base: "Salvador" },
  { id: "E02", nome: "Equipe 02", base: "Salvador" },
  { id: "E03", nome: "Equipe 03", base: "Lauro de Freitas" },
  { id: "E04", nome: "Equipe 04", base: "Camaçari" },
  { id: "E05", nome: "Equipe 05", base: "Feira de Santana" },
  { id: "E06", nome: "Equipe 06", base: "Vitória da Conquista" },
  { id: "E07", nome: "Equipe 07", base: "Juazeiro" },
  { id: "E08", nome: "Equipe 08", base: "Ilhéus" },
];

export const STATUS_ORDEM = ["programada", "em-execucao", "concluida", "impedida"];

// Para onde cada status da ordem pode ir. Impedida pode ser reprogramada; concluída é final.
export const TRANSICOES_ORDEM = {
  "programada": ["em-execucao", "impedida"],
  "em-execucao": ["concluida", "impedida"],
  "impedida": ["programada"],
  "concluida": [],
};

const NOMES = { "programada": "programada", "em-execucao": "em execução", "concluida": "concluída", "impedida": "impedida" };

export function criarTabelaOrdens(banco) {
  banco.exec(`
    CREATE TABLE IF NOT EXISTS ordens (
      numero       TEXT PRIMARY KEY,
      solicitacao  TEXT NOT NULL REFERENCES solicitacoes(numero),
      equipe       TEXT NOT NULL,
      previsao     TEXT NOT NULL,
      status       TEXT NOT NULL DEFAULT 'programada',
      observacao   TEXT NOT NULL DEFAULT '',
      criada       TEXT NOT NULL,
      atualizada   TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS historico_por_numero ON historico(numero);
    CREATE INDEX IF NOT EXISTS ordens_por_solicitacao ON ordens(solicitacao);
  `);
}

const p = (n) => String(n).padStart(2, "0");
const numeroOrdem = (n) => `OS-${String(n).padStart(5, "0")}`;

// Se não houver nenhuma ordem, cria uma para cada solicitação que já passou por atendimento.
// Funciona tanto num banco novo quanto num banco que já tinha as 5.000 do encontro 12.
export function semearOrdens(banco) {
  const { total } = banco.prepare("SELECT COUNT(*) AS total FROM ordens").get();
  if (total > 0) return 0;
  const linhas = banco.prepare(`
    SELECT s.numero, s.municipio, s.status, s.abertura,
           (SELECT em FROM historico h WHERE h.numero = s.numero AND h.para = 'em-atendimento' ORDER BY id LIMIT 1) AS inicio,
           (SELECT observacao FROM historico h WHERE h.numero = s.numero AND h.para = 'concluida' ORDER BY id LIMIT 1) AS obs
    FROM solicitacoes s
    WHERE s.status IN ('em-atendimento', 'concluida')
    ORDER BY s.abertura, s.numero`).all();
  const inserir = banco.prepare(`INSERT INTO ordens (numero, solicitacao, equipe, previsao, status, observacao, criada, atualizada)
                                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  banco.exec("BEGIN");
  linhas.forEach((s, i) => {
    const daBase = EQUIPES.filter((e) => e.base === s.municipio);
    const equipe = (daBase.length ? daBase[i % daBase.length] : EQUIPES[i % EQUIPES.length]).id;
    const criada = s.inicio ?? `${s.abertura}T08:00`;
    const previsao = criada.slice(0, 10);
    const concluida = s.status === "concluida";
    const status = concluida ? "concluida" : i % 2 === 0 ? "em-execucao" : "programada";
    inserir.run(numeroOrdem(i + 1), s.numero, equipe, previsao, status, concluida ? (s.obs || "Serviço executado.") : "", criada, criada);
  });
  banco.exec("COMMIT");
  return linhas.length;
}

function hoje() {
  const d = new Date();
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const texto = (v) => (typeof v === "string" ? v.trim() : "");

// Os dados que a API devolve para uma ordem: a ordem e um resumo da solicitação de origem
const SELECT_ORDEM = `
  SELECT o.numero, o.solicitacao, o.equipe, o.previsao, o.status, o.observacao, o.criada, o.atualizada,
         s.tipo, s.municipio, s.bairro, s.prioridade
  FROM ordens o JOIN solicitacoes s ON s.numero = o.solicitacao`;

function paraJson(linha) {
  const equipe = EQUIPES.find((e) => e.id === linha.equipe);
  return { ...linha, nomeEquipe: equipe ? `${equipe.nome} · ${equipe.base}` : linha.equipe };
}

export function criarRotasOrdens({ banco, agoraISO, enviar, lerJson, naoAceito }) {
  const sql = {
    buscar: banco.prepare(`${SELECT_ORDEM} WHERE o.numero = ?`),
    maior: banco.prepare("SELECT MAX(CAST(substr(numero, 4) AS INTEGER)) AS maior FROM ordens"),
    ativa: banco.prepare("SELECT numero FROM ordens WHERE solicitacao = ? AND status IN ('programada', 'em-execucao', 'impedida')"),
    solicitacao: banco.prepare("SELECT numero, status FROM solicitacoes WHERE numero = ?"),
    inserir: banco.prepare(`INSERT INTO ordens (numero, solicitacao, equipe, previsao, status, observacao, criada, atualizada)
                            VALUES (?, ?, ?, ?, 'programada', '', ?, ?)`),
    mudar: banco.prepare("UPDATE ordens SET status = ?, observacao = ?, atualizada = ? WHERE numero = ?"),
    concluirSolicitacao: banco.prepare("UPDATE solicitacoes SET status = 'concluida', atualizada = ? WHERE numero = ? AND status = 'em-atendimento'"),
    evento: banco.prepare("INSERT INTO historico (numero, de, para, observacao, em) VALUES (?, ?, ?, ?, ?)"),
  };

  function listar(params) {
    const condicoes = [];
    const valores = [];
    const status = params.get("status");
    const equipe = params.get("equipe");
    const busca = texto(params.get("busca") ?? "");
    if (status && STATUS_ORDEM.includes(status)) { condicoes.push("o.status = ?"); valores.push(status); }
    if (equipe && EQUIPES.some((e) => e.id === equipe)) { condicoes.push("o.equipe = ?"); valores.push(equipe); }
    if (busca) { condicoes.push("(o.numero LIKE ? OR o.solicitacao LIKE ? OR s.bairro LIKE ?)"); valores.push(`%${busca}%`, `%${busca}%`, `%${busca}%`); }
    const onde = condicoes.length ? "WHERE " + condicoes.join(" AND ") : "";
    const { total } = banco.prepare(`SELECT COUNT(*) AS total FROM ordens o JOIN solicitacoes s ON s.numero = o.solicitacao ${onde}`).get(...valores);
    const porPagina = Math.min(100, Math.max(1, Number(params.get("porPagina")) || 100));
    const pagina = Math.max(1, Number(params.get("pagina")) || 1);
    const itens = banco.prepare(`${SELECT_ORDEM} ${onde} ORDER BY o.criada DESC, o.numero DESC LIMIT ? OFFSET ?`)
      .all(...valores, porPagina, (pagina - 1) * porPagina).map(paraJson);
    return { itens, total, pagina, porPagina };
  }

  function validarNova(dados) {
    const campos = {};
    const numero = texto(dados.solicitacao);
    const solicitacao = numero ? sql.solicitacao.get(numero) : null;
    if (!numero) campos.solicitacao = "Informe o número da solicitação.";
    else if (!solicitacao) campos.solicitacao = `A solicitação ${numero} não existe.`;
    else if (solicitacao.status !== "em-atendimento") campos.solicitacao = "A solicitação precisa estar em atendimento para gerar uma ordem.";
    if (!EQUIPES.some((e) => e.id === dados.equipe)) campos.equipe = "Escolha a equipe.";
    const previsao = texto(dados.previsao);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(previsao) || Number.isNaN(Date.parse(previsao))) campos.previsao = "Informe a data prevista.";
    else if (previsao < hoje()) campos.previsao = "A data prevista não pode ser no passado.";
    return { campos, numero };
  }

  // Devolve true se tratou o endereço; false se não é uma rota de ordens
  return async function atenderOrdens(partes, metodo, url, requisicao, resposta) {
    if (partes[1] === "equipes" && partes.length === 2) {
      if (metodo !== "GET") return naoAceito(resposta, metodo), true;
      return enviar(resposta, 200, EQUIPES), true;
    }
    if (partes[1] !== "ordens") return false;
    if (partes.length > 4) return enviar(resposta, 404, { mensagem: "Endereço não encontrado." }), true;

    // /api/ordens
    if (partes.length === 2) {
      if (metodo === "GET") return enviar(resposta, 200, listar(url.searchParams)), true;
      if (metodo !== "POST") return naoAceito(resposta, metodo), true;
      const dados = await lerJson(requisicao);
      if (!dados) return enviar(resposta, 400, { mensagem: "O corpo da requisição deve ser um objeto JSON." }), true;
      const { campos, numero } = validarNova(dados);
      if (Object.keys(campos).length > 0) return enviar(resposta, 422, { mensagem: "Há campos inválidos.", campos }), true;
      const ativa = sql.ativa.get(numero);
      if (ativa) {
        return enviar(resposta, 409, { mensagem: `Já existe a ${ativa.numero} em aberto para a solicitação ${numero}.`, ordem: ativa.numero }), true;
      }
      const { maior } = sql.maior.get();
      const nova = numeroOrdem((maior ?? 0) + 1);
      const agora = agoraISO();
      sql.inserir.run(nova, numero, dados.equipe, texto(dados.previsao), agora, agora);
      return enviar(resposta, 201, paraJson(sql.buscar.get(nova))), true;
    }

    const numero = partes[2];
    const atual = sql.buscar.get(numero);
    if (!atual) return enviar(resposta, 404, { mensagem: `Ordem ${numero} não encontrada.` }), true;

    // /api/ordens/:numero
    if (partes.length === 3) {
      if (metodo !== "GET") return naoAceito(resposta, metodo), true;
      return enviar(resposta, 200, paraJson(atual)), true;
    }

    // /api/ordens/:numero/status
    if (partes[3] !== "status") return enviar(resposta, 404, { mensagem: "Endereço não encontrado." }), true;
    if (metodo !== "PATCH") return naoAceito(resposta, metodo), true;
    const dados = await lerJson(requisicao);
    if (!dados) return enviar(resposta, 400, { mensagem: "O corpo da requisição deve ser um objeto JSON." }), true;
    if (!STATUS_ORDEM.includes(dados.status)) {
      return enviar(resposta, 422, { mensagem: "Há campos inválidos.", campos: { status: "Status desconhecido." } }), true;
    }
    if (atual.status === dados.status) {
      return enviar(resposta, 409, { mensagem: `A ordem já está ${NOMES[atual.status]}.`, statusAtual: atual.status }), true;
    }
    if (!TRANSICOES_ORDEM[atual.status].includes(dados.status)) {
      return enviar(resposta, 409, {
        mensagem: `A ordem está ${NOMES[atual.status]} e não pode passar para ${NOMES[dados.status]}.`, statusAtual: atual.status,
      }), true;
    }
    const observacao = texto(dados.observacao);
    if ((dados.status === "concluida" || dados.status === "impedida") && observacao.length < 5) {
      const campo = dados.status === "impedida" ? "Explique o impedimento, com pelo menos 5 caracteres." : "Descreva o que foi feito, com pelo menos 5 caracteres.";
      return enviar(resposta, 422, { mensagem: "Há campos inválidos.", campos: { observacao: campo } }), true;
    }
    const agora = agoraISO();
    banco.exec("BEGIN");
    sql.mudar.run(dados.status, observacao, agora, numero);
    // Concluir a ordem conclui a solicitação de origem, com o mesmo relato do campo
    if (dados.status === "concluida") {
      const mudou = sql.concluirSolicitacao.run(agora, atual.solicitacao);
      if (mudou.changes > 0) sql.evento.run(atual.solicitacao, "em-atendimento", "concluida", `${observacao} (${numero})`, agora);
    }
    banco.exec("COMMIT");
    return enviar(resposta, 200, paraJson(sql.buscar.get(numero))), true;
  };
}
