import { useState } from 'react';
import Cartao from "./Cartao";

type TentativasDeContatoProps = {
  numero: string
};

export default function TentativasDeContato({ numero }: TentativasDeContatoProps) {
  const [tentativas, setTentativas] = useState(0);

  console.log("Desenhando", numero, tentativas);

  const resetarTentativas = () => setTentativas(0);

  const registrarNovaTentativa = () => setTentativas(tentativas + 1);

  return (
    <Cartao titulo="Retorno ao cliente">
      <p>Solicitações <strong>{numero}</strong>: {tentativas} {tentativas === 1 ? 'tentativa' : 'tentativas' } de contato</p>
      <div className="acoes">
        <button
          type="button"
          onClick={registrarNovaTentativa}>Registrar tentativa</button>
        <button
          type="button"
          className="button"
          onClick={resetarTentativas}>Zerar</button>
      </div>
    </Cartao>
  );
};
