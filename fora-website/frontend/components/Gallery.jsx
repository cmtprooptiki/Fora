'use client';

import { useState, useEffect } from 'react';
import { mediaUrl } from '../lib/strapi';

export default function Gallery({ forum }) {
  const photos = forum?.fotografies || [];
  const len = photos.length;
  const [active, setActive] = useState(null); // δείκτης εικόνας (ή null)

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

  return (
    <section className="section section--grey" id="gallery">
      <div className="container">
        <div className="section__head">
          <span className="section__eyebrow">Φωτογραφίες</span>
          <h2>Στιγμές από το Forum</h2>
        </div>

        <div className="gallery">
          {photos.map((p, i) => {
            const full = mediaUrl(p.url);
            const thumb = p.formats?.small?.url ? mediaUrl(p.formats.small.url) : full;
            return (
              <button
                type="button"
                className="gallery__item"
                key={i}
                onClick={() => setActive(i)}
                aria-label="Μεγέθυνση φωτογραφίας"
              >
                <img src={thumb} alt={p.alternativeText || 'Φωτογραφία Forum'} loading="lazy" />
              </button>
            );
          })}
        </div>
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
