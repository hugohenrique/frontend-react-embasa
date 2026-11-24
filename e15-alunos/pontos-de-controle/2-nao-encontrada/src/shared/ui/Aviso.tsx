type AvisoProps = {
  texto: string;
  aoFechar: () => void;
};

// Um aviso flutuante, no canto da tela. Quem decide quando ele some é a página.
export function Aviso({ texto, aoFechar }: AvisoProps) {
  return (
    <div className="aviso">
      <p>{texto}</p>
      <button type="button" className="aviso-fechar" aria-label="Fechar aviso" onClick={aoFechar}>
        ×
      </button>
    </div>
  );
}
