import { createContext } from "react";

export type Perfil = "atendente" | "supervisor";

export type Usuario = {
  nome: string;
  perfil: Perfil;
};

export const nomesDosPerfis: Record<Perfil, string> = {
  atendente: "Atendente",
  supervisor: "Supervisor",
};

// O canal da sessão: quem está usando a Central. Começa null, que quer dizer "ninguém".
export const SessaoContext = createContext<Usuario | null>(null);
