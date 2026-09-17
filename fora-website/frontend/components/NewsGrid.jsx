'use client';

import { useState } from 'react';
import Pagination from './Pagination';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
function mediaUrl(url) {
  if (!url) return '';
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

const MINES = [
  'Ιανουαρίου', 'Φεβρουαρίου', 'Μαρτίου', 'Απριλίου', 'Μαΐου', 'Ιουνίου',
  'Ιουλίου', 'Αυγούστου', 'Σεπτεμβρίου', 'Οκτωβρίου', 'Νοεμβρίου', 'Δεκεμβρίου',
];
function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getDate()} ${MINES[d.getMonth()]} ${d.getFullYear()}`;
}

// Πλέγμα άρθρων 3 ανά σειρά, με σελιδοποίηση 6 ανά σελίδα (2 σειρές), όπως
// στο σχέδιο. Είναι client component ώστε η αλλαγή σελίδας να μη χρειάζεται
// νέα φόρτωση.
const PER_PAGE = 6;

export default function NewsGrid({ articles = [] }) {
  const [page, setPage] = useState(1);
  const total = Math.max(1, Math.ceil(articles.length / PER_PAGE));
  const safe = Math.min(page, total);
  const start = (safe - 1) * PER_PAGE;
  const shown = articles.slice(start, start + PER_PAGE);

  return (
    <>
      <div className="nws-grid">
        {shown.map((a) => {
          const img = a.eikona?.url ? mediaUrl(a.eikona.url) : null;
          return (
            <article className="nws-card" key={a.id}>
              <a className="nws-card__link" href={`/news/${a.slug}/`}>
                {img ? (
                  <img className="nws-card__img" src={img} alt={a.titlos} loading="lazy" />
                ) : (
                  <span className="nws-card__img nws-card__img--empty" aria-hidden="true" />
                )}
                <div className="nws-card__body">
                  <div className="nws-meta">
                    <span className="nws-meta__date">{formatDate(a.imerominia)}</span>
                    <span className="nws-tag">{a.katigoria || 'Νέα'}</span>
                  </div>
                  <h3 className="nws-card__title">{a.titlos}</h3>
                  {a.perilipsi && <p className="nws-card__sum">{a.perilipsi}</p>}
                  <span className="nws-card__more">
                    Διαβάστε περισσότερα
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
                         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 12h15M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </a>
            </article>
          );
        })}
      </div>

      {total > 1 && (
        <Pagination page={safe} totalPages={total} onChange={setPage} />
      )}
    </>
  );
}
