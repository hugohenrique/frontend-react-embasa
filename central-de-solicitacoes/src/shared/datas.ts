// Funções de data, usadas em qualquer parte do sistema

// Converte "2026-11-09" em "09/11/2026"
export function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

// Converte "2026-11-16T09:42" em "16/11/2026 às 09:42"
export function formatarDataHora(iso: string): string {
  const [data, hora] = iso.split("T");
  return `${formatarData(data)} às ${hora}`;
}

// A data de hoje no formato "2026-11-12", no fuso do computador
export function hojeISO(): string {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  return `${agora.getFullYear()}-${mes}-${dia}`;
}
