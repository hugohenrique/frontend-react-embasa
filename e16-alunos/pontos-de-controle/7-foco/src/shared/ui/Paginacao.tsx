type PaginacaoProps = {
  pagina: number;
  totalDePaginas: number;
  aoMudar: (pagina: number) => void;
};

// Anterior, "Página 3 de 250" e Próxima. Não sabe o que está sendo paginado.
export function Paginacao({ pagina, totalDePaginas, aoMudar }: PaginacaoProps) {
  if (totalDePaginas <= 1) return null;

  return (
    <nav className="paginacao" aria-label="Páginas da lista">
      <button
        type="button"
        className="botao-linha"
        disabled={pagina === 1}
        onClick={() => aoMudar(pagina - 1)}
      >
        ← Anterior
      </button>
      <span aria-live="polite">
        Página {pagina} de {totalDePaginas}
      </span>
      <button
        type="button"
        className="botao-linha"
        disabled={pagina === totalDePaginas}
        onClick={() => aoMudar(pagina + 1)}
      >
        Próxima →
      </button>
    </nav>
  );
}
