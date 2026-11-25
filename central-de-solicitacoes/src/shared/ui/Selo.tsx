import type { ReactNode } from "react";

// O tom diz o que a cor comunica. O selo não sabe se é de solicitação ou de ordem.
export type Tom = "informacao" | "andamento" | "sucesso" | "neutro" | "perigo";

type SeloProps = {
  tom: Tom;
  children: ReactNode;
};

export function Selo({ tom, children }: SeloProps) {
  return <span className={`selo selo-${tom}`}>{children}</span>;
}
