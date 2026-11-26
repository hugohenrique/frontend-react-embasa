import { useState } from "react";

type TentativasContatoProps = {
  numero: string;
};

export function TentativasContato({ numero }: TentativasContatoProps) {
  const [tentativas, setTentativas] = useState(0);

  return (
    <div className="contato">
      <p aria-live="polite">
        Solicitação <strong>{numero}</strong>: {tentativas} {tentativas === 1 ? "tentativa" : "tentativas"} de contato.
      </p>
      <div className="acoes">
        <button type="button" onClick={() => setTentativas(tentativas + 1)}>
          Registrar tentativa
        </button>
        <button type="button" className="botao-secundario" onClick={() => setTentativas(0)}>
          Zerar
        </button>
      </div>
    </div>
  );
}
