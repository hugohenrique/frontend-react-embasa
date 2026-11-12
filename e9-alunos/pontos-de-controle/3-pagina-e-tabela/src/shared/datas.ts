// Funções de data, usadas em qualquer parte do sistema

// Converte "2026-11-09" em "09/11/2026"
export function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

// A data de hoje no formato "2026-11-12", no fuso do computador
export function hojeISO(): string {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  return `${agora.getFullYear()}-${mes}-${dia}`;
}
