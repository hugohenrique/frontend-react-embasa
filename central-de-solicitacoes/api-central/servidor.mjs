// API da Central de Solicitações: uma API REST de verdade, para o curso.
// Guarda os dados num banco SQLite (dados/central.db), usando só o Node.
// NÃO é a API da Embasa: os dados são fictícios.
//
// Como rodar, num terminal próprio, de dentro da pasta central-de-solicitacoes:
//   npm run api                    (com o script no package.json)
//   node api-central/servidor.mjs  (sem o script)
// Opções:
//   --atraso 3000   cada resposta demora 3000 ms (padrão: 300)
//   --falha 50      50% das respostas falham com 503 (padrão: 0)
//   --porta 4000    usa outra porta (padrão: 3333)
//   --reiniciar     apaga o banco e volta aos dados iniciais
//   --volume 5000   completa o banco até 5000 solicitações fictícias (para ver uma central cheia)

import { createServer } from "node:http";
import { parseArgs } from "node:util";

const [maior, menor] = process.versions.node.split(".").map(Number);
if (maior < 22 || (maior === 22 && menor < 13)) {
  console.error(`Esta API precisa do Node 22.13 ou mais novo. O seu é ${process.version}.`);
  process.exit(1);
}

const { abrirBanco, agoraISO, garantirVolume, ARQUIVO } = await import("./banco.mjs");
const { validarNovaSolicitacao, validarMudancaDeStatus, STATUS, PRIORIDADES } = await import("./regras.mjs");

const { values: opcoes } = parseArgs({
  options: {
    porta: { type: "string", default: "3333" },
    atraso: { type: "string", default: "300" },
    falha: { type: "string", default: "0" },
    reiniciar: { type: "boolean", default: false },
    volume: { type: "string", default: "0" },
  },
});
const PORTA = Number(opcoes.porta);
const ATRASO = Number(opcoes.atraso);
const FALHA = Number(opcoes.falha);

const { banco, novo } = abrirBanco({ reiniciar: opcoes.reiniciar });
const gerados = garantirVolume(banco, Number(opcoes.volume));

// ---------- Consultas ----------
const sql = {
  buscar: banco.prepare("SELECT * FROM solicitacoes WHERE numero = ?"),
  historico: banco.prepare("SELECT de, para, observacao, em FROM historico WHERE numero = ? ORDER BY id"),
  maiorNumero: banco.prepare("SELECT MAX(CAST(substr(numero, 4) AS INTEGER)) AS maior FROM solicitacoes"),
  inserir: banco.prepare(`INSERT INTO solicitacoes (numero, tipo, municipio, bairro, prioridade, relato, status, abertura, atualizada)
                          VALUES (?, ?, ?, ?, ?, ?, 'aberta', ?, ?)`),
  evento: banco.prepare("INSERT INTO historico (numero, de, para, observacao, em) VALUES (?, ?, ?, ?, ?)"),
  mudarStatus: banco.prepare("UPDATE solicitacoes SET status = ?, atualizada = ? WHERE numero = ?"),
  resumo: banco.prepare("SELECT status, COUNT(*) AS total FROM solicitacoes GROUP BY status"),
};

// Converte a linha do banco no formato do contrato
function paraJson(linha) {
  const { relato, ...resto } = linha;
  return relato ? { ...resto, relato } : resto;
}

function listar(params) {
  const condicoes = [];
  const valores = [];
  const status = params.get("status");
  const prioridade = params.get("prioridade");
  const busca = (params.get("busca") ?? "").trim();
  if (status && STATUS.includes(status)) { condicoes.push("status = ?"); valores.push(status); }
  if (prioridade && PRIORIDADES.includes(prioridade)) { condicoes.push("prioridade = ?"); valores.push(prioridade); }
  if (busca) { condicoes.push("(bairro LIKE ? OR numero LIKE ?)"); valores.push(`%${busca}%`, `%${busca}%`); }
  const onde = condicoes.length ? "WHERE " + condicoes.join(" AND ") : "";

  const { total } = banco.prepare(`SELECT COUNT(*) AS total FROM solicitacoes ${onde}`).get(...valores);
  const porPagina = Math.min(100, Math.max(1, Number(params.get("porPagina")) || 100));
  const pagina = Math.max(1, Number(params.get("pagina")) || 1);
  const itens = banco
    .prepare(`SELECT * FROM solicitacoes ${onde} ORDER BY abertura DESC, numero DESC LIMIT ? OFFSET ?`)
    .all(...valores, porPagina, (pagina - 1) * porPagina)
    .map(paraJson);
  return { itens, total, pagina, porPagina };
}

function detalhar(numero) {
  const linha = sql.buscar.get(numero);
  if (!linha) return null;
  return { ...paraJson(linha), historico: sql.historico.all(numero) };
}

// ---------- HTTP ----------
function esperar(ms) {
  return new Promise((resolver) => setTimeout(resolver, ms));
}

function enviar(resposta, status, corpo) {
  resposta.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  resposta.end(JSON.stringify(corpo, null, 2));
}

function lerCorpo(requisicao) {
  return new Promise((resolver, rejeitar) => {
    let texto = "";
    requisicao.setEncoding("utf-8");
    requisicao.on("data", (parte) => (texto += parte));
    requisicao.on("end", () => resolver(texto));
    requisicao.on("error", rejeitar);
  });
}

async function lerJson(requisicao) {
  try {
    const dados = JSON.parse(await lerCorpo(requisicao));
    if (dados === null || typeof dados !== "object" || Array.isArray(dados)) return null;
    return dados;
  } catch {
    return null;
  }
}

const naoAceito = (resposta, metodo) =>
  enviar(resposta, 405, { mensagem: `O método ${metodo} não é aceito neste endereço.` });

async function atender(requisicao, resposta) {
  await esperar(ATRASO);
  const url = new URL(requisicao.url, "http://localhost");
  const partes = url.pathname.split("/").filter(Boolean).map(decodeURIComponent);
  const metodo = requisicao.method;

  if (partes[0] !== "api") {
    return enviar(resposta, 404, { mensagem: "Endereço não encontrado. Experimente /api/solicitacoes." });
  }
  if (FALHA > 0 && Math.random() * 100 < FALHA) {
    return enviar(resposta, 503, { mensagem: "Serviço indisponível (falha simulada pela opção --falha)." });
  }

  // GET /api/resumo
  if (partes[1] === "resumo" && partes.length === 2) {
    if (metodo !== "GET") return naoAceito(resposta, metodo);
    const porStatus = Object.fromEntries(STATUS.map((s) => [s, 0]));
    for (const { status, total } of sql.resumo.all()) porStatus[status] = total;
    return enviar(resposta, 200, porStatus);
  }

  if (partes[1] !== "solicitacoes" || partes.length > 4) {
    return enviar(resposta, 404, { mensagem: "Endereço não encontrado. Experimente /api/solicitacoes." });
  }

  // /api/solicitacoes
  if (partes.length === 2) {
    if (metodo === "GET") return enviar(resposta, 200, listar(url.searchParams));
    if (metodo !== "POST") return naoAceito(resposta, metodo);

    const dados = await lerJson(requisicao);
    if (!dados) return enviar(resposta, 400, { mensagem: "O corpo da requisição deve ser um objeto JSON." });
    const campos = validarNovaSolicitacao(dados);
    if (Object.keys(campos).length > 0) {
      return enviar(resposta, 422, { mensagem: "Há campos inválidos.", campos });
    }
    const { maior } = sql.maiorNumero.get();
    const numero = `26-${String((maior ?? 0) + 1).padStart(5, "0")}`;
    const agora = agoraISO();
    banco.exec("BEGIN");
    sql.inserir.run(numero, dados.tipo, dados.municipio.trim(), dados.bairro.trim(), dados.prioridade,
      (dados.relato ?? "").trim(), agora.slice(0, 10), agora);
    sql.evento.run(numero, null, "aberta", "Registrada pelo atendimento.", agora);
    banco.exec("COMMIT");
    return enviar(resposta, 201, detalhar(numero));
  }

  const numero = partes[2];
  const atual = sql.buscar.get(numero);
  if (!atual) return enviar(resposta, 404, { mensagem: `Solicitação ${numero} não encontrada.` });

  // GET /api/solicitacoes/:numero
  if (partes.length === 3) {
    if (metodo !== "GET") return naoAceito(resposta, metodo);
    return enviar(resposta, 200, detalhar(numero));
  }

  // PATCH /api/solicitacoes/:numero/status
  if (partes[3] !== "status") {
    return enviar(resposta, 404, { mensagem: "Endereço não encontrado." });
  }
  if (metodo !== "PATCH") return naoAceito(resposta, metodo);
  const dados = await lerJson(requisicao);
  if (!dados) return enviar(resposta, 400, { mensagem: "O corpo da requisição deve ser um objeto JSON." });
  const { campos, conflito } = validarMudancaDeStatus(atual.status, dados);
  if (conflito) return enviar(resposta, 409, { mensagem: conflito, statusAtual: atual.status });
  if (Object.keys(campos).length > 0) {
    return enviar(resposta, 422, { mensagem: "Há campos inválidos.", campos });
  }
  const agora = agoraISO();
  banco.exec("BEGIN");
  sql.mudarStatus.run(dados.status, agora, numero);
  sql.evento.run(numero, atual.status, dados.status, (dados.observacao ?? "").trim(), agora);
  banco.exec("COMMIT");
  return enviar(resposta, 200, detalhar(numero));
}

const servidor = createServer((requisicao, resposta) => {
  const inicio = Date.now();
  resposta.on("finish", () => {
    console.log(`${requisicao.method} ${requisicao.url} → ${resposta.statusCode} (${Date.now() - inicio} ms)`);
  });
  atender(requisicao, resposta).catch((erro) => {
    console.error(erro);
    try { banco.exec("ROLLBACK"); } catch { /* não havia transação aberta */ }
    if (!resposta.headersSent) enviar(resposta, 500, { mensagem: "Erro interno na API." });
  });
});

servidor.on("error", (erro) => {
  if (erro.code === "EADDRINUSE") {
    console.error(`A porta ${PORTA} já está em uso. A API já está rodando em outro terminal?`);
    process.exit(1);
  }
  throw erro;
});

servidor.listen(PORTA, () => {
  console.log(`API da Central rodando em http://localhost:${PORTA}/api/solicitacoes`);
  console.log(`Banco: ${ARQUIVO}${novo ? " (criado agora, com os dados iniciais)" : ""}`);
  if (gerados > 0) console.log(`Volume: ${gerados} solicitações fictícias geradas agora.`);
  const { total } = banco.prepare("SELECT COUNT(*) AS total FROM solicitacoes").get();
  console.log(`Solicitações no banco: ${total}`);
  console.log(`Atraso: ${ATRASO} ms · Falha simulada: ${FALHA}% · Ctrl + C para parar`);
});
