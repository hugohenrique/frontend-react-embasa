type MensagemErroProps = {
  texto: string;
  aoTentarNovamente: () => void;
};

// Uma falha que a pessoa pode resolver tentando de novo. Não sabe de onde veio o erro.
export function MensagemErro({ texto, aoTentarNovamente }: MensagemErroProps) {
  return (
    <div className="erro-carregamento" role="alert">
      <p>{texto}</p>
      <button type="button" className="botao-secundario" onClick={aoTentarNovamente}>
        Tentar de novo
      </button>
    </div>
  );
}
