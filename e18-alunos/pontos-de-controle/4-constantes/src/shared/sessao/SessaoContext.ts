import { createContext, useContext } from "react";

export type Perfil = "atendente" | "supervisor";

export type Usuario = {
  nome: string;
  perfil: Perfil;
};

export const nomesPerfis: Record<Perfil, string> = {
  atendente: "Atendente",
  supervisor: "Supervisor",
};

// O que o Context entrega: quem está logado e as duas ações da sessão
type ValorSessao = {
  usuario: Usuario | null;
  entrar: (usuario: Usuario) => void;
  sair: () => void;
};

// O canal da sessão. Começa null, que quer dizer "não há provedor em volta".
export const SessaoContext = createContext<ValorSessao | null>(null);

// Atalho para ler a sessão, com o aviso claro se faltar o provedor
export function useSessao() {
  const sessao = useContext(SessaoContext);
  if (sessao === null) {
    throw new Error("useSessao precisa estar dentro do ProvedorSessao.");
  }
  return sessao;
}
