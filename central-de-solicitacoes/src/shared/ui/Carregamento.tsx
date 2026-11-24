import { ReactNode } from 'react';
import { MensagemDeErro } from './MensagemDeErro';

export type Situacao = "carregando" | "erro" | "pronto";

type CarregamentoProps = {
  situacao: Situacao;
  carregando: string;
  erro: string;
  aoTentarDeNovo: () => void;
  children: ReactNode;
};

export default function Carregamento({ situacao, carregando, erro, aoTentarDeNovo, children }: CarregamentoProps) {
  if (situacao === "carregando") {
    return <p className="vazio" role="status">{carregando}</p>;
  }
  if (situacao === "erro") {
    return <MensagemDeErro texto={erro} aoTentarDeNovo={aoTentarDeNovo} />;
  }
  return <>{children}</>;
};
