'use client';

import { useState, useEffect, useMemo } from 'react';
import { mediaUrl, youtubeId } from '../lib/strapi';
import Pagination from './Pagination';

// Πόσες φωτογραφίες ανά σελίδα.
const PER_PAGE = 8;

// --- Παρουσιάσεις ομιλητών (Figma «Section gallery — Παρουσιάσεις») --------

// Μόνο όσες έχουν ανεβασμένο αρχείο εμφανίζονται.
const parousiaseisMeArxeio = (forum) =>
  (forum?.parousiaseis || []).filter((p) => p?.arxeio?.url);

// Το Strapi δίνει το μέγεθος σε KB· το δείχνουμε όπως στο σχέδιο: «3,2 MB».
function megethos(kb) {
  if (!kb) return '';
  if (kb >= 1024) return `${(kb / 1024).toFixed(1).replace('.', ',')} MB`;
  return `${Math.round(kb)} KB`;
}

// «Λήψη αρχείου»: το PDF σερβίρεται από άλλο domain (api.…), οπότε το απλό
// download δεν δουλεύει παντού. Το κατεβάζουμε ως blob· αν ο browser δεν το
// επιτρέψει, το ανοίγουμε σε νέα καρτέλα ώστε να αποθηκευτεί από εκεί.
async function katevasma(e, url, onoma) {
  e.preventDefault();
  try {
    const r = await fetch(url, { mode: 'cors' });
    if (!r.ok) throw new Error(String(r.status));
    const blob = await r.blob();
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = onoma;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(href), 4000);
  } catch {
    window.open(url, '_blank', 'noopener');
  }
}

const IconPresentation = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 4h18M4 4v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4M12 15v3M8 21l4-3 4 3" />
  </svg>
);
const IconDoc = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </svg>
);
const IconDownload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 4v11M7 10l5 5 5-5M4 19h16" />
  </svg>
);

function PresentationCard({ p, etos }) {
  const url = mediaUrl(p.arxeio.url);
  const img = p.eikonaExofyllou
    ? mediaUrl(
        p.eikonaExofyllou.formats?.medium?.url ||
          p.eikonaExofyllou.formats?.small?.url ||
          p.eikonaExofyllou.url
      )
    : null;
  const skouro = p.xroma === 'Σκούρο';
  const onomaArxeiou = p.arxeio.name || `${p.titlos}.pdf`;

  // Κάτω από τον τίτλο: ομιλητής και θεματική κατηγορία
  const ypografi = [p.omilitis, p.katigoria].filter(Boolean).join(' · ');
  // Στοιχεία αρχείου: «24 διαφάνειες · 3,2 MB · Ελληνικά»
  const stoixeia = [
    p.diafaneies ? `${p.diafaneies} διαφάνειες` : '',
    megethos(p.arxeio.size),
    p.glossa || '',
  ].filter(Boolean);

  return (
    <article className={`pres ${skouro ? 'pres--dark' : ''} ${img ? '' : 'pres--noimg'}`}>
      <a
        className="pres__cover"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Προβολή παρουσίασης: ${p.titlos}`}
      >
        <span className="pres__panel">
          <span className="pres__mast">
            <span className="pres__forum">FORUM / {etos}</span>
            {img && (
              <span className="pres__icon">
                <IconPresentation />
              </span>
            )}
          </span>
          <span className="pres__titles">
            {p.katigoria && <span className="pres__topic">{p.katigoria}</span>}
            <span className="pres__ctitle">{p.titlos}</span>
            {p.ypotitlos && <span className="pres__csub">{p.ypotitlos}</span>}
          </span>
          <span className="pres__foot">
            <span>Παρουσίαση</span>
            {p.diafaneies ? (
              <span>
                01 / {String(p.diafaneies).padStart(2, '0')}
              </span>
            ) : null}
          </span>
        </span>
        {img && (
          <span className="pres__img">
            <img src={img} alt="" loading="lazy" />
          </span>
        )}
        <span className="pres__badge">
          <IconDoc />
          PDF
        </span>
      </a>

      <div className="pres__info">
        <h3 className="pres__title">{p.titlos}</h3>
        {ypografi && <p className="pres__meta">{ypografi}</p>}
        {stoixeia.length > 0 && <p className="pres__details">{stoixeia.join(' · ')}</p>}
        <div className="pres__actions">
          <a className="pres__view" href={url} target="_blank" rel="noopener noreferrer">
            Προβολή PDF <span aria-hidden="true">→</span>
          </a>
          <a
            className="pres__dl"
            href={url}
            download={onomaArxeiou}
            onClick={(e) => katevasma(e, url, onomaArxeiou)}
          >
            <IconDownload />
            Λήψη αρχείου
          </a>
        </div>
      </div>
    </article>
  );
}

// Ενότητα «ΣΤΙΓΜΙΟΤΥΠΑ ΤΟΥ FORUM» (Figma: Section_Gallery)
// Φίλτρα: Όλα / Φωτογραφίες / Βίντεο / Παρουσιάσεις + επιλογή έτους.
export default function MediaGallery({ forums = [], currentForum }) {
  // Διοργανώσεις με υλικό (φωτογραφίες, βίντεο ή παρουσιάσεις), νεότερη πρώτα.
  const withMedia = useMemo(
    () =>
      (forums || [])
        .filter(
          (f) =>
            (f.fotografies || []).length ||
            (f.vinteo || []).length ||
            parousiaseisMeArxeio(f).length
        )
        .slice()
        .sort((a, b) => (b.etos || 0) - (a.etos || 0)),
    [forums]
  );
  // Η καρτέλα «Παρουσιάσεις» εμφανίζεται μόλις υπάρξει έστω μία, σε οποιοδήποτε έτος.
  const yparxounParousiaseis = withMedia.some((f) => parousiaseisMeArxeio(f).length);

  const defaultYear =
    currentForum?.etos && withMedia.some((f) => f.etos === currentForum.etos)
      ? currentForum.etos
      : withMedia[0]?.etos ?? null;

  const [year, setYear] = useState(defaultYear);
  const [tab, setTab] = useState('ola'); // ola | fotografies | vinteo | parousiaseis
  const [active, setActive] = useState(null); // δείκτης φωτογραφίας στο lightbox
  const [page, setPage] = useState(1);

  const forum = withMedia.find((f) => f.etos === year) || withMedia[0] || null;
  const photos = forum?.fotografies || [];
  const videos = (forum?.vinteo || [])
    .map((v) => ({ ...v, id: youtubeId(v.syndesmosYoutube) }))
    .filter((v) => v.id);
  const parousiaseis = parousiaseisMeArxeio(forum);
  const len = photos.length;

  // Σελιδοποίηση φωτογραφιών
  const totalPages = Math.max(1, Math.ceil(len / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PER_PAGE;
  const pagePhotos = photos.slice(start, start + PER_PAGE);

  // Αλλαγή σελίδας: πάμε στην αρχή της ενότητας για να μη «χαθεί» ο χρήστης.
  const goPage = (p) => {
    setPage(p);
    const el = document.getElementById('gallery');
    if (el) el.scrollIntoView({ block: 'start', behavior: 'smooth' });
  };

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
  const showPres = tab === 'ola' || tab === 'parousiaseis';
  const activePhoto = active !== null && photos[active] ? mediaUrl(photos[active].url) : null;

  return (
    <section className="section mgal" id="gallery">
      <div className="container">
        <div className="thematics__head mgal__head">
          <span>Στιγμιότυπα</span>
          <span className="mgal__head-accent">Του Forum</span>
        </div>
        <p className="thematics__intro mgal__intro">
          Φωτογραφικά στιγμιότυπα, βίντεο, ομιλίες και παρουσιάσεις από τη
          διοργάνωση
        </p>

        <div className="mgal__bar">
          <div className="mgal__tabs" role="tablist" aria-label="Φίλτρα υλικού">
            {[
              ['ola', 'Όλα'],
              ['fotografies', 'Φωτογραφίες'],
              ['vinteo', 'Βίντεο'],
              ...(yparxounParousiaseis ? [['parousiaseis', 'Παρουσιάσεις']] : []),
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={tab === key}
                className={`mgal__tab ${tab === key ? 'is-active' : ''}`}
                onClick={() => {
                  setTab(key);
                  setPage(1);
                }}
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
                  setPage(1);
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
          <>
            <div className="mgal__grid">
              {pagePhotos.map((p, i) => {
                const abs = start + i; // απόλυτη θέση (για τη μεγέθυνση)
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
          </>
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

        {/* Παρουσιάσεις ομιλητών — πλέγμα 2 στηλών με κάρτες PDF */}
        {showPres && parousiaseis.length > 0 && (
          <div className="pres-collection">
            <div className="pres-grid">
              {parousiaseis.map((p, i) => (
                <PresentationCard key={p.id || i} p={p} etos={forum?.etos} />
              ))}
            </div>
            <p className="pres-count">
              {parousiaseis.length === 1
                ? '1 παρουσίαση'
                : `${parousiaseis.length} παρουσιάσεις`}
            </p>
          </div>
        )}

        {tab === 'parousiaseis' && parousiaseis.length === 0 && (
          <p className="thematics__intro">
            Δεν υπάρχουν παρουσιάσεις για αυτή τη διοργάνωση.
          </p>
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
