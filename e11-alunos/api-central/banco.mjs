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
