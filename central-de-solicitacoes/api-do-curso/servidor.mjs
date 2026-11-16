// API do curso: uma API REST fictícia, feita só para as aulas.
// NÃO é a API da Embasa. Roda na sua máquina, usa só o Node (sem instalar nada),
// guarda os dados em memória e volta ao estado inicial sempre que é reiniciada.
//
// Como rodar, num terminal próprio, de dentro da pasta central-de-solicitacoes:
//   node api-do-curso/servidor.mjs
// Opções:
//   --atraso 3000   cada resposta demora 3000 ms (padrão: 600)
//   --falha 50      50% das respostas falham com 503 (padrão: 0)
//   --porta 4000    usa outra porta (padrão: 3333)

import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { parseArgs } from "node:util";

const { values: opcoes } = parseArgs({
  options: {
    porta: { type: "string", default: "3333" },
    atraso: { type: "string", default: "600" },
    falha: { type: "string", default: "0" },
  },
});
const PORTA = Number(opcoes.porta);
const ATRASO = Number(opcoes.atraso);
const FALHA = Number(opcoes.falha);

const TIPOS = ["vazamento", "falta-agua", "religacao"];
const PRIORIDADES = ["baixa", "media", "alta"];

let solicitacoes = JSON.parse(readFileSync(new URL("./dados.json", import.meta.url), "utf-8"));

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

function hojeISO() {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  return `${agora.getFullYear()}-${mes}-${dia}`;
}

function proximoNumero() {
  const maior = Math.max(0, ...solicitacoes.map((s) => Number(s.numero.slice(3))));
  return `26-${String(maior + 1).padStart(5, "0")}`;
}

// Confere os campos de uma solicitação nova. Devolve um objeto com um erro por campo.
function validar(dados) {
  const campos = {};
  if (!TIPOS.includes(dados.tipo)) campos.tipo = "Escolha vazamento, falta-agua ou religacao.";
  if (typeof dados.municipio !== "string" || dados.municipio.trim() === "") campos.municipio = "Informe o município.";
  if (typeof dados.bairro !== "string" || dados.bairro.trim() === "") campos.bairro = "Informe o bairro.";
  if (!PRIORIDADES.includes(dados.prioridade)) campos.prioridade = "Escolha baixa, media ou alta.";
  if (dados.relato !== undefined && typeof dados.relato !== "string") campos.relato = "O relato deve ser um texto.";
  if (typeof dados.relato === "string" && dados.relato.length > 500) campos.relato = "O relato tem no máximo 500 caracteres.";
  return campos;
}

async function atender(requisicao, resposta) {
  await esperar(ATRASO);

  const url = new URL(requisicao.url, "http://localhost");
  const partes = url.pathname.split("/").filter(Boolean);

  if (partes[0] !== "api" || partes[1] !== "solicitacoes" || partes.length > 3) {
    return enviar(resposta, 404, { mensagem: "Endereço não encontrado. Experimente /api/solicitacoes." });
  }
  if (FALHA > 0 && Math.random() * 100 < FALHA) {
    return enviar(resposta, 503, { mensagem: "Serviço indisponível (falha simulada pela opção --falha)." });
  }

  // /api/solicitacoes
  if (partes.length === 2) {
    if (requisicao.method === "GET") {
      return enviar(resposta, 200, { itens: solicitacoes, total: solicitacoes.length });
    }
    if (requisicao.method === "POST") {
      let dados;
      try {
        dados = JSON.parse(await lerCorpo(requisicao));
      } catch {
        return enviar(resposta, 400, { mensagem: "O corpo da requisição não é um JSON válido." });
      }
      if (dados === null || typeof dados !== "object" || Array.isArray(dados)) {
        return enviar(resposta, 400, { mensagem: "O corpo da requisição deve ser um objeto JSON." });
      }
      const campos = validar(dados);
      if (Object.keys(campos).length > 0) {
        return enviar(resposta, 422, { mensagem: "Há campos inválidos.", campos });
      }
      const nova = {
        numero: proximoNumero(),
        tipo: dados.tipo,
        municipio: dados.municipio.trim(),
        bairro: dados.bairro.trim(),
        prioridade: dados.prioridade,
        abertura: hojeISO(),
        ...(dados.relato ? { relato: dados.relato.trim() } : {}),
      };
      solicitacoes = [nova, ...solicitacoes];
      return enviar(resposta, 201, nova);
    }
    return enviar(resposta, 405, { mensagem: `O método ${requisicao.method} não é aceito neste endereço.` });
  }

  // /api/solicitacoes/:numero
  const numero = decodeURIComponent(partes[2]);
  if (requisicao.method !== "GET") {
    return enviar(resposta, 405, { mensagem: `O método ${requisicao.method} não é aceito neste endereço.` });
  }
  const encontrada = solicitacoes.find((s) => s.numero === numero);
  if (!encontrada) {
    return enviar(resposta, 404, { mensagem: `Solicitação ${numero} não encontrada.` });
  }
  return enviar(resposta, 200, encontrada);
}

const servidor = createServer((requisicao, resposta) => {
  const inicio = Date.now();
  resposta.on("finish", () => {
    console.log(`${requisicao.method} ${requisicao.url} → ${resposta.statusCode} (${Date.now() - inicio} ms)`);
  });
  atender(requisicao, resposta).catch((erro) => {
    console.error(erro);
    if (!resposta.headersSent) enviar(resposta, 500, { mensagem: "Erro interno na API do curso." });
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
  console.log(`API do curso rodando em http://localhost:${PORTA}/api/solicitacoes`);
  console.log(`Atraso: ${ATRASO} ms · Falha simulada: ${FALHA}% · Ctrl + C para parar`);
  console.log("Os dados ficam em memória: ao reiniciar, voltam ao estado inicial.");
});
