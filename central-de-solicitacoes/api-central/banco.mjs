// O banco de dados da API: SQLite, num arquivo (dados/central.db).
// Usa o node:sqlite, que já vem no Node: nada para instalar.
// Os dados sobrevivem quando a API é reiniciada. Para voltar ao início: --reiniciar.

import { mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { SOLICITACOES_INICIAIS } from "./dados-iniciais.mjs";

// O node:sqlite avisa que ainda está em evolução. Para a aula, escondemos só esse aviso.
process.removeAllListeners("warning");
process.on("warning", (aviso) => {
  if (aviso.name === "ExperimentalWarning" && /SQLite/i.test(aviso.message)) return;
  console.warn(aviso);
});
const { DatabaseSync } = await import("node:sqlite");

const PASTA = fileURLToPath(new URL("./dados/", import.meta.url));
export const ARQUIVO = PASTA + "central.db";

export function abrirBanco({ reiniciar = false } = {}) {
  mkdirSync(PASTA, { recursive: true });
  if (reiniciar) rmSync(ARQUIVO, { force: true });

  const banco = new DatabaseSync(ARQUIVO);
  banco.exec(`
    CREATE TABLE IF NOT EXISTS solicitacoes (
      numero      TEXT PRIMARY KEY,
      tipo        TEXT NOT NULL,
      municipio   TEXT NOT NULL,
      bairro      TEXT NOT NULL,
      prioridade  TEXT NOT NULL,
      relato      TEXT NOT NULL DEFAULT '',
      status      TEXT NOT NULL DEFAULT 'aberta',
      abertura    TEXT NOT NULL,
      atualizada  TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS historico (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      numero      TEXT NOT NULL REFERENCES solicitacoes(numero),
      de          TEXT,
      para        TEXT NOT NULL,
      observacao  TEXT NOT NULL DEFAULT '',
      em          TEXT NOT NULL
    );
  `);

  const { total } = banco.prepare("SELECT COUNT(*) AS total FROM solicitacoes").get();
  const novo = total === 0;
  if (novo) semear(banco);
  return { banco, novo };
}

// Preenche um banco vazio com as solicitações fictícias do curso
function semear(banco) {
  const inserir = banco.prepare(`
    INSERT INTO solicitacoes (numero, tipo, municipio, bairro, prioridade, relato, status, abertura, atualizada)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const registrarEvento = banco.prepare(
    "INSERT INTO historico (numero, de, para, observacao, em) VALUES (?, ?, ?, ?, ?)");

  banco.exec("BEGIN");
  for (const s of SOLICITACOES_INICIAIS) {
    const ultimo = s.eventos.length > 0 ? s.eventos[s.eventos.length - 1].em : `${s.abertura}T${s.hora}`;
    inserir.run(s.numero, s.tipo, s.municipio, s.bairro, s.prioridade, s.relato ?? "", s.status, s.abertura, ultimo);
    registrarEvento.run(s.numero, null, "aberta", "Registrada pelo atendimento.", `${s.abertura}T${s.hora}`);
    let de = "aberta";
    for (const e of s.eventos) {
      registrarEvento.run(s.numero, de, e.para, e.observacao ?? "", e.em);
      de = e.para;
    }
  }
  banco.exec("COMMIT");
}

// Data e hora locais, no formato "2026-11-16T09:42"
export function agoraISO() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

// Gera solicitações fictícias até o banco ter pelo menos `quantidade`.
// Serve para ver a Central com o volume de uma central de verdade (--volume 5000).
// Sempre gera os mesmos dados, na mesma ordem: rodar de novo não duplica.
export function garantirVolume(banco, quantidade) {
  const { total } = banco.prepare("SELECT COUNT(*) AS total FROM solicitacoes").get();
  if (total >= quantidade) return 0;

  const LUGARES = [
    ["Salvador", ["Pituba", "Liberdade", "Cabula", "Cajazeiras", "Itapuã", "Barra", "Brotas", "Federação", "Pernambués", "Sussuarana"]],
    ["Feira de Santana", ["Centro", "Tomba", "Campo Limpo", "Sobradinho"]],
    ["Lauro de Freitas", ["Ipitanga", "Vilas do Atlântico", "Itinga", "Portão"]],
    ["Camaçari", ["Gleba A", "Gleba B", "Phoc", "Centro"]],
    ["Vitória da Conquista", ["Candeias", "Brasil", "Recreio"]],
    ["Juazeiro", ["Centro", "Santo Antônio", "João Paulo II"]],
    ["Ilhéus", ["Pontal", "Malhado", "Centro"]],
  ];
  const TIPOS = ["vazamento", "falta-agua", "religacao"];
  const PRIORIDADES = ["baixa", "media", "media", "alta"];
  const RELATOS = {
    "vazamento": ["Água minando na calçada.", "Vazamento no ramal, perto do hidrômetro.", "Água escorrendo pela sarjeta."],
    "falta-agua": ["Imóvel sem água desde a madrugada.", "Rua inteira sem água.", "Pouca pressão no período da manhã."],
    "religacao": ["Religação após pagamento da fatura.", "Religação após troca de titularidade.", "Imóvel será ocupado; pedido de religação."],
  };
  const OBS = {
    "concluida": "Serviço executado pela equipe de campo.",
    "cancelada": "Cancelada a pedido do cliente.",
  };

  // Números pseudoaleatórios com semente fixa: os mesmos dados toda vez
  let semente = 20261118;
  const sorteio = () => ((semente = (semente * 1103515245 + 12345) % 2147483648) / 2147483648);
  const um = (lista) => lista[Math.floor(sorteio() * lista.length)];
  const p = (n) => String(n).padStart(2, "0");

  const inserir = banco.prepare(`
    INSERT INTO solicitacoes (numero, tipo, municipio, bairro, prioridade, relato, status, abertura, atualizada)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const evento = banco.prepare("INSERT INTO historico (numero, de, para, observacao, em) VALUES (?, ?, ?, ?, ?)");
  const { menor } = banco.prepare("SELECT MIN(CAST(substr(numero, 4) AS INTEGER)) AS menor FROM solicitacoes").get();

  const faltam = quantidade - total;
  const base = Date.UTC(2026, 10, 16);
  banco.exec("BEGIN");
  for (let i = 0; i < faltam; i++) {
    // Os gerados ficam antes dos dados iniciais: números menores e datas mais antigas
    const numero = `26-${String((menor ?? 8801) - faltam + i).padStart(5, "0")}`;
    const dias = Math.floor(((faltam - i) / faltam) * 300) + 4;
    const d = new Date(base - dias * 86400000);
    const abertura = `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}`;
    const h = 7 + Math.floor(sorteio() * 8);
    const min = p(Math.floor(sorteio() * 60));
    const hora = `${p(h)}:${min}`;
    const [municipio, bairros] = um(LUGARES);
    const tipo = um(TIPOS);
    const prioridade = um(PRIORIDADES);
    const sorte = sorteio();
    const status = sorte < 0.78 ? "concluida" : sorte < 0.88 ? "cancelada" : sorte < 0.95 ? "em-atendimento" : "aberta";
    const relato = prioridade === "alta" || sorteio() < 0.5 ? um(RELATOS[tipo]) : "";
    const ultima = status === "concluida" ? `${abertura}T${p(h + 4)}:${min}` : status === "cancelada" ? `${abertura}T${p(h + 2)}:${min}` : status === "em-atendimento" ? `${abertura}T${p(h + 1)}:${min}` : `${abertura}T${hora}`;
    inserir.run(numero, tipo, municipio, um(bairros), prioridade, relato, status, abertura, ultima);
    evento.run(numero, null, "aberta", "Registrada pelo atendimento.", `${abertura}T${hora}`);
    if (status !== "aberta" && status !== "cancelada") {
      evento.run(numero, "aberta", "em-atendimento", "", `${abertura}T${p(h + 1)}:${min}`);
    }
    if (status === "concluida") evento.run(numero, "em-atendimento", "concluida", OBS.concluida, `${abertura}T${p(h + 4)}:${min}`);
    if (status === "cancelada") evento.run(numero, "aberta", "cancelada", OBS.cancelada, `${abertura}T${p(h + 2)}:${min}`);
  }
  banco.exec("COMMIT");
  return faltam;
}
