type MensagemDeErroProps = {
  texto: string;
  aoTentarDeNovo: () => void;
};

// Uma falha que a pessoa pode resolver tentando de novo. Não sabe de onde veio o erro.
export function MensagemDeErro({ texto, aoTentarDeNovo }: MensagemDeErroProps) {
  return (
    <div className="erro-carregamento" role="alert">
      <p>{texto}</p>
      <button type="button" className="botao-secundario" onClick={aoTentarDeNovo}>
        Tentar de novo
      </button>
    </div>
  );
}
