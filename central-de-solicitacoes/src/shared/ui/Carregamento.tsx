import type { ReactNode } from "react";
import { MensagemDeErro } from "./MensagemDeErro";

// Em que pé está um carregamento: um valor só, nunca dois ao mesmo tempo
export type Situacao = "carregando" | "erro" | "pronto";

type CarregamentoProps = {
  situacao: Situacao;
  carregando: string;
  erro: string;
  aoTentarDeNovo: () => void;
  children: ReactNode;
};

// Mostra o carregando ou o erro. Pronto, mostra o que veio dentro dele (children).
export function Carregamento({ situacao, carregando, erro, aoTentarDeNovo, children }: CarregamentoProps) {
  if (situacao === "carregando") {
    return <p className="vazio" role="status">{carregando}</p>;
  }
  if (situacao === "erro") {
    return <MensagemDeErro texto={erro} aoTentarDeNovo={aoTentarDeNovo} />;
  }
  return <>{children}</>;
}
