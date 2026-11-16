type MensagemDeErroProps = {
  texto: string,
  aoTentarDeNovo: () => void;
};

export default function MensagemDeErro({ texto, aoTentarDeNovo }: MensagemDeErroProps) {
  return (
    <div className="erro-carregamento" role="alert">
      <p>{texto}</p>
      <button type="button" className="botao-secundario" onClick={aoTentarDeNovo}>
        Tentar de novo
      </button>
    </div>
  );
};
