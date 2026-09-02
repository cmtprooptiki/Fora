'use client';

import { useState, useEffect } from 'react';
import { mediaUrl } from '../lib/strapi';
import Pagination from './Pagination';

const PER_PAGE = 8;

export default function Gallery({ forum }) {
  const photos = forum?.fotografies || [];
  const len = photos.length;
  const [active, setActive] = useState(null); // δείκτης εικόνας (ή null)
  const [page, setPage] = useState(1);

  const close = () => setActive(null);
  const next = () => setActive((a) => (a === null ? a : (a + 1) % len));
  const prev = () => setActive((a) => (a === null ? a : (a - 1 + len) % len));

  // Πλοήγηση με το πληκτρολόγιο ΜΟΝΟ όσο είναι ανοιχτή η μεγέθυνση.
  useEffect(() => {
    if (active === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        close();
      } else if (e.key === 'ArrowRight' || e.key === 'Right') {
        e.preventDefault();
        setActive((a) => (a + 1) % len);
      } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        e.preventDefault();
        setActive((a) => (a - 1 + len) % len);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, len]);

  if (len === 0) return null;

  const activePhoto = active !== null ? mediaUrl(photos[active].url) : null;

  // Σελιδοποίηση
  const totalPages = Math.max(1, Math.ceil(len / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PER_PAGE;
  const pagePhotos = photos.slice(start, start + PER_PAGE);
  const goPage = (p) => {
    setPage(p);
    const el = document.getElementById('gallery');
    if (el) el.scrollIntoView({ block: 'start', behavior: 'smooth' });
  };

  return (
    <section className="section section--grey" id="gallery">
      <div className="container">
        <div className="section__head">
          <span className="section__eyebrow">Φωτογραφίες</span>
          <h2>Στιγμές από το Forum</h2>
        </div>

        <div className="gallery">
          {pagePhotos.map((p, i) => {
            const abs = start + i;
            const full = mediaUrl(p.url);
            const thumb = p.formats?.small?.url ? mediaUrl(p.formats.small.url) : full;
            return (
              <button
                type="button"
                className="gallery__item"
                key={abs}
                onClick={() => setActive(abs)}
                aria-label="Μεγέθυνση φωτογραφίας"
              >
                <img src={thumb} alt={p.alternativeText || 'Φωτογραφία Forum'} loading="lazy" />
              </button>
            );
          })}
        </div>

        {totalPages > 1 && (
          <>
            <p className="pager__count">
              Φωτογραφίες {start + 1}–{Math.min(start + PER_PAGE, len)} από {len}
            </p>
            <Pagination page={safePage} totalPages={totalPages} onChange={goPage} />
          </>
        )}
      </div>

      {active !== null && (
        <div className="lightbox" onClick={close}>
          <button className="lightbox__close" aria-label="Κλείσιμο" onClick={close}>
            ×
          </button>

          {len > 1 && (
            <button
              className="lightbox__nav lightbox__nav--prev"
              aria-label="Προηγούμενη φωτογραφία"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
            >
              ‹
            </button>
          )}

          <img
            className="lightbox__img"
            src={activePhoto}
            alt="Φωτογραφία Forum"
            onClick={(e) => e.stopPropagation()}
          />

          {len > 1 && (
            <button
              className="lightbox__nav lightbox__nav--next"
              aria-label="Επόμενη φωτογραφία"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
            >
              ›
            </button>
          )}

          {len > 1 && (
            <span className="lightbox__counter">
              {active + 1} / {len}
            </span>
          )}
        </div>
      )}
    </section>
  );
}
