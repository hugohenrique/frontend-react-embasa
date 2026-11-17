type AvisoProps = {
  texto: string;
  aoFechar: () => void;
};

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
