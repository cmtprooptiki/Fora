'use client';

import { useState, useEffect, useMemo } from 'react';
import { mediaUrl, youtubeId } from '../lib/strapi';

// Ενότητα «ΣΤΙΓΜΙΟΤΥΠΑ ΤΟΥ FORUM» (Figma: Section_Gallery)
// Φίλτρα: Όλα / Φωτογραφίες / Βίντεο + επιλογή έτους (ανά διοργάνωση).
export default function MediaGallery({ forums = [], currentForum }) {
  // Διοργανώσεις με υλικό (φωτογραφίες ή βίντεο), από τη νεότερη στην παλαιότερη.
  const withMedia = useMemo(
    () =>
      (forums || [])
        .filter((f) => (f.fotografies || []).length || (f.vinteo || []).length)
        .slice()
        .sort((a, b) => (b.etos || 0) - (a.etos || 0)),
    [forums]
  );

  const defaultYear =
    currentForum?.etos && withMedia.some((f) => f.etos === currentForum.etos)
      ? currentForum.etos
      : withMedia[0]?.etos ?? null;

  const [year, setYear] = useState(defaultYear);
  const [tab, setTab] = useState('ola'); // ola | fotografies | vinteo
  const [active, setActive] = useState(null); // δείκτης φωτογραφίας στο lightbox

  const forum = withMedia.find((f) => f.etos === year) || withMedia[0] || null;
  const photos = forum?.fotografies || [];
  const videos = (forum?.vinteo || [])
    .map((v) => ({ ...v, id: youtubeId(v.syndesmosYoutube) }))
    .filter((v) => v.id);
  const len = photos.length;

  const close = () => setActive(null);

  useEffect(() => {
    if (active === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActive((a) => (a + 1) % len);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActive((a) => (a - 1 + len) % len);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, len]);

  if (withMedia.length === 0) return null;

  const showPhotos = tab === 'ola' || tab === 'fotografies';
  const showVideos = tab === 'ola' || tab === 'vinteo';
  const activePhoto = active !== null && photos[active] ? mediaUrl(photos[active].url) : null;

  return (
    <section className="section mgal" id="gallery">
      <div className="container">
        <div className="thematics__head mgal__head">
          <span>Στιγμιότυπα</span>
          <span className="mgal__head-accent">Του Forum</span>
        </div>
        <p className="thematics__intro mgal__intro">
          Φωτογραφικά στιγμιότυπα, ομιλίες και παρασκήνια από τις εργασίες των
          διοργανώσεων, αποτυπώνοντας την ενέργεια της μετάβασης.
        </p>

        <div className="mgal__bar">
          <div className="mgal__tabs" role="tablist" aria-label="Φίλτρα υλικού">
            {[
              ['ola', 'Όλα'],
              ['fotografies', 'Φωτογραφίες'],
              ['vinteo', 'Βίντεο'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={tab === key}
                className={`mgal__tab ${tab === key ? 'is-active' : ''}`}
                onClick={() => setTab(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {withMedia.length > 1 && (
            <label className="mgal__year">
              <span className="sr-only">Έτος διοργάνωσης</span>
              <select
                value={year ?? ''}
                onChange={(e) => {
                  setYear(Number(e.target.value));
                  setActive(null);
                }}
              >
                {withMedia.map((f) => (
                  <option key={f.id} value={f.etos}>
                    {f.etos}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        {showPhotos && len > 0 && (
          <div className="mgal__grid">
            {photos.map((p, i) => {
              const full = mediaUrl(p.url);
              const thumb = p.formats?.medium?.url
                ? mediaUrl(p.formats.medium.url)
                : p.formats?.small?.url
                  ? mediaUrl(p.formats.small.url)
                  : full;
              return (
                <button
                  type="button"
                  className="mgal__item"
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label="Μεγέθυνση φωτογραφίας"
                >
                  <img src={thumb} alt={p.alternativeText || 'Φωτογραφία Forum'} loading="lazy" />
                </button>
              );
            })}
          </div>
        )}

        {showVideos && videos.length > 0 && (
          <div className="grid videos mgal__videos">
            {videos.map((v, i) => (
              <div className="video" key={i}>
                <div className="video__frame">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${v.id}`}
                    title={v.titlos || 'Βίντεο Forum'}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                {v.titlos && <p className="video__title">{v.titlos}</p>}
              </div>
            ))}
          </div>
        )}

        {showVideos && !showPhotos && videos.length === 0 && (
          <p className="thematics__intro">Δεν υπάρχουν βίντεο για αυτή τη διοργάνωση.</p>
        )}
      </div>

      {active !== null && activePhoto && (
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
                setActive((a) => (a - 1 + len) % len);
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
                setActive((a) => (a + 1) % len);
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
