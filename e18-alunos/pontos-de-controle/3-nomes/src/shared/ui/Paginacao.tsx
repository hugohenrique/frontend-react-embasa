type PaginacaoProps = {
  pagina: number;
  totalPaginas: number;
  aoMudar: (pagina: number) => void;
};

// Anterior, "Página 3 de 250" e Próxima. Não sabe o que está sendo paginado.
export function Paginacao({ pagina, totalPaginas, aoMudar }: PaginacaoProps) {
  if (totalPaginas <= 1) return null;

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
        Página {pagina} de {totalPaginas}
      </span>
      <button
        type="button"
        className="botao-linha"
        disabled={pagina === totalPaginas}
        onClick={() => aoMudar(pagina + 1)}
      >
        Próxima →
      </button>
    </nav>
  );
}
