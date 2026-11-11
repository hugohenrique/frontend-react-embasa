import type { ReactNode } from "react";

type CartaoProps = {
  titulo: string;
  children: ReactNode;
};

export function Cartao({ titulo, children }: CartaoProps) {
  return (
    <section className="cartao">
      <h2>{titulo}</h2>
      {children}
    </section>
  );
}
