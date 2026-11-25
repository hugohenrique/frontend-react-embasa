import { ReactNode } from 'react';

export type Tom = "informacao" | "andamento" | "sucesso" | "neutro" | "perigo";

type SeloProps = {
  tom: Tom;
  children: ReactNode;
};

export default function Selo({ tom, children }: SeloProps) {
  return <span className={`selo selo-${tom}`}>{children}</span>;
};
