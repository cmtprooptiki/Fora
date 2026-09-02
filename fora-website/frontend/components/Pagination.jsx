'use client';

// Επαναχρησιμοποιήσιμη σελιδοποίηση (‹ 1 … 4 5 6 … 12 ›).
// Σε στενές οθόνες τα κουμπιά «διπλώνουν» σε δεύτερη γραμμή (δείτε το CSS).
export default function Pagination({ page, totalPages, onChange, label = 'Σελίδες' }) {
  if (!totalPages || totalPages <= 1) return null;

  // Δείχνουμε: 1η, την τρέχουσα ±1, την τελευταία — και «…» στα κενά.
  const around = 1;
  const wanted = new Set([1, totalPages]);
  for (let i = page - around; i <= page + around; i += 1) {
    if (i > 1 && i < totalPages) wanted.add(i);
  }
  const sorted = [...wanted].sort((a, b) => a - b);

  const items = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) items.push({ gap: true, key: `gap-${n}` });
    items.push({ n, key: `p-${n}` });
  });

  return (
    <nav className="pager" aria-label={label}>
      <button
        type="button"
        className="pager__btn"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Προηγούμενη σελίδα"
      >
        ‹
      </button>

      {items.map((it) =>
        it.gap ? (
          <span className="pager__gap" key={it.key} aria-hidden="true">
            …
          </span>
        ) : (
          <button
            type="button"
            key={it.key}
            className={`pager__num ${it.n === page ? 'is-active' : ''}`}
            aria-current={it.n === page ? 'page' : undefined}
            aria-label={`Σελίδα ${it.n}`}
            onClick={() => onChange(it.n)}
          >
            {it.n}
          </button>
        )
      )}

      <button
        type="button"
        className="pager__btn"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Επόμενη σελίδα"
      >
        ›
      </button>
    </nav>
  );
}
