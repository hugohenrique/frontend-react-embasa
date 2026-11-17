import { useState } from "react";

export function DicasAtendimento() {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <button type="button" className="botao-secundario" aria-expanded={aberto} onClick={() => setAberto(!aberto)}>
        {aberto ? "Ocultar dicas" : "Mostrar dicas"}
      </button>

      {aberto && (
        <ul className="dicas">
          <li>Confirme a matrícula do imóvel: ela está na conta de água.</li>
          <li>Peça um ponto de referência, além do endereço.</li>
          <li>Pergunte desde quando o problema acontece.</li>
          <li>Confirme um telefone: a equipe pode precisar ligar antes de ir.</li>
        </ul>
      )}
    </>
  );
}
