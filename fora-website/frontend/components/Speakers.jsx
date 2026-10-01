'use client';

import { useState, useEffect, useRef } from 'react';

// Πέρα από αυτή την απόσταση (ή με αρκετά γρήγορη κίνηση) το «φύλλο» κλείνει.
const SYRSIMO_ORIO = 110;      // px
const SYRSIMO_TAXYTITA = 0.55; // px ανά ms

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

// Ετικέτα πάνω στη φωτογραφία. Όλοι εμφανίζονται ως «ΟΜΙΛΗΤΗΣ»· όσοι
// συντονίζουν ενότητα γράφονται εδώ (αρκεί το επώνυμο, χωρίς τόνους).
const SYNTONISTES = ['παπαδακης', 'πολυζος'];

const XORIS_TONOUS = (s) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

function rolosGia(onoma) {
  const kathara = XORIS_TONOUS(onoma);
  return SYNTONISTES.some((s) => kathara.includes(s)) ? 'Συντονιστής' : 'Ομιλητής';
}
function mediaUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${STRAPI_URL}${url}`;
}

export default function Speakers({ forum }) {
  const speakers = forum?.omilites || [];
  // Κρατάμε τη ΘΕΣΗ του ομιλητή (όχι το αντικείμενο), ώστε το παράθυρο να
  // μπορεί να πηγαίνει στον προηγούμενο/επόμενο χωρίς να κλείσει. -1 = κλειστό.
  const [activeIndex, setActiveIndex] = useState(-1);
  const total = speakers.length;
  const active = activeIndex >= 0 && activeIndex < total ? speakers[activeIndex] : null;

  // --- Σύρσιμο του «φύλλου» προς τα κάτω (κινητά/tablet), όπως στους χάρτες ---
  const [dragY, setDragY] = useState(0);     // πόσο έχει κατέβει με το δάχτυλο
  const [dragging, setDragging] = useState(false);
  const [closing, setClosing] = useState(false);
  const dragRef = useRef(null);
  const timerRef = useRef(null);

  const einaiMikriOthoni = () =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 1024px)').matches;

  const closeModal = () => {
    if (!einaiMikriOthoni()) {
      setActiveIndex(-1);
      setDragY(0);
      return;
    }
    // Στο «φύλλο» κλείνουμε με γλίστρημα προς τα κάτω
    setDragging(false);
    setClosing(true);
    timerRef.current = window.setTimeout(() => {
      setActiveIndex(-1);
      setClosing(false);
      setDragY(0);
    }, 240);
  };

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const onHandleDown = (e) => {
    if (!einaiMikriOthoni()) return;
    dragRef.current = { startY: e.clientY, lastY: e.clientY, lastT: performance.now(), v: 0 };
    setDragging(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ο browser μπορεί να μην το υποστηρίζει — το σύρσιμο δουλεύει ούτως ή άλλως */
    }
  };

  const onHandleMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    const now = performance.now();
    const dt = now - d.lastT;
    if (dt > 0) d.v = (e.clientY - d.lastY) / dt;
    d.lastY = e.clientY;
    d.lastT = now;
    setDragY(Math.max(0, e.clientY - d.startY));
  };

  const onHandleUp = (e) => {
    const d = dragRef.current;
    if (!d) return;
    dragRef.current = null;
    setDragging(false);
    const apostasi = Math.max(0, e.clientY - d.startY);
    if (apostasi > SYRSIMO_ORIO || d.v > SYRSIMO_TAXYTITA) closeModal();
    else setDragY(0); // δεν έφτασε αρκετά κάτω — επιστρέφει στη θέση του
  };

  useEffect(() => {
    if (!active) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeModal();
      else if (e.key === 'ArrowRight') setActiveIndex((i) => (i + 1) % total);
      else if (e.key === 'ArrowLeft') setActiveIndex((i) => (i - 1 + total) % total);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active, total]);

  // Χωρίς ομιλητές:
  //  • στο ΤΡΕΧΟΝ Forum η ενότητα παραμένει και δείχνει μήνυμα αναμονής,
  //  • σε προηγούμενο Forum δεν έχει νόημα («θα ανακοινωθούν») και κρύβεται.
  const isCurrent = !!forum?.trexonForum;
  const hasSpeakers = speakers.length > 0;
  // «Υπό διαμόρφωση»: ίδιος διακόπτης με τη λωρίδα κορυφής — ένα πεδίο στο
  // Strapi ελέγχει όλα τα μηνύματα προσχεδίου.
  const isDraft = !!forum?.mynimaKorifis?.trim();
  if (!hasSpeakers && !isCurrent) return null;

  const activePhoto = active?.fotografia?.url ? mediaUrl(active.fotografia.url) : null;

  return (
    // Λευκό φόντο τμήματος (όπως το «Πρόγραμμα» πιο πάνω) — ο γκρι τόνος
    // μεταφέρθηκε στις κάρτες των ομιλητών (.speaker στο globals.css).
    <section className="section" id="omilites">
      <div className="container">
        {/* Υποσημείωση προσχεδίου — πάνω από τον τίτλο της ενότητας.
            Εμφανίζεται όσο το Forum είναι «υπό διαμόρφωση», δηλαδή όσο έχει
            κείμενο το «Μήνυμα Κορυφής» (mynimaKorifis) στο Strapi. Αδειάζοντάς
            το, φεύγουν μαζί και η λωρίδα κορυφής και αυτή η υποσημείωση. */}
        {isDraft && (
          <p className="draft-note">
            <span className="draft-note__star" aria-hidden="true">*</span>
            Το πρόγραμμα είναι προσωρινό και ενδέχεται να τροποποιηθεί. Οι ομιλητές
            θα επιβεβαιωθούν σύντομα.
          </p>
        )}

        <div className="thematics__head">
          <span>Ομιλητές</span>
          <span>Του Forum</span>
        </div>
        <p className="thematics__intro">
          Κορυφαία στελέχη της υγείας, ακαδημαϊκοί και εκπρόσωποι φορέων χάραξης
          πολιτικής που μοιράζονται τεχνογνωσία και βέλτιστες πρακτικές για τον
          εκσυγχρονισμό των νοσοκομείων.
        </p>

        {!hasSpeakers && (
          <div className="spk-empty">
            <span className="spk-empty__icon" aria-hidden="true">i</span>
            <p className="spk-empty__title">Οι ομιλητές θα ανακοινωθούν σύντομα</p>
            <p className="spk-empty__text">
              Το πρόγραμμα βρίσκεται υπό διαμόρφωση. Μείνετε συντονισμένοι!
            </p>
          </div>
        )}

        {hasSpeakers && (
        <div className="grid speakers">
          {speakers.map((sp, i) => {
            const photo = sp.fotografia?.url ? mediaUrl(sp.fotografia.url) : null;
            const initials = (sp.onoma || '')
              .split(' ')
              .map((w) => w[0])
              .slice(0, 2)
              .join('');
            const inner = (
              <>
                <div className="speaker__photo">
                  {photo ? (
                    <img src={photo} alt={sp.onoma} loading="lazy" />
                  ) : (
                    <span className="speaker__initials">{initials}</span>
                  )}
                  <span className="speaker__badge">{rolosGia(sp.onoma)}</span>
                </div>
                <h3 className="speaker__name">{sp.onoma}</h3>
                {sp.idiotita && <p className="speaker__title">{sp.idiotita}</p>}
              </>
            );

            return (
              <div
                className="speaker speaker--clickable"
                key={i}
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                onClick={() => setActiveIndex(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveIndex(i);
                  }
                }}
              >
                {inner}
              </div>
            );
          })}

          {/* Τελευταίο πλακίδιο: όσο η διοργάνωση είναι υπό διαμόρφωση, κρατά
              θέση για τα ονόματα που δεν έχουν ανακοινωθεί ακόμη. */}
          {isDraft && (
            <div className="speaker speaker--soon">
              <span className="spk-empty__icon" aria-hidden="true">i</span>
              <p className="spk-empty__title">Νέα Ονόματα Έρχονται Σύντομα</p>
              <p className="spk-empty__text">
                Μείνετε συντονισμένοι για τις επόμενες ανακοινώσεις.
              </p>
            </div>
          )}
        </div>
        )}
      </div>

      {active && (
        <div
          className="smodal-overlay"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label={`Βιογραφικό: ${active.onoma}`}
        >
          <div
            className={`smodal${dragging ? ' smodal--dragging' : ''}`}
            onClick={(e) => e.stopPropagation()}
            style={
              closing
                ? { transform: 'translateY(100%)' }
                : dragY
                  ? { transform: `translateY(${dragY}px)` }
                  : undefined
            }
          >
            {/* Κεφαλίδα: διαδρομή αριστερά, κλείσιμο δεξιά. Σε κινητά/tablet
                ολόκληρη λειτουργεί ως λαβή — σύρετε προς τα κάτω για κλείσιμο. */}
            <div
              className="smodal__topbar"
              onPointerDown={onHandleDown}
              onPointerMove={onHandleMove}
              onPointerUp={onHandleUp}
              onPointerCancel={onHandleUp}
            >
              {/* Λαβή «φύλλου» — φαίνεται μόνο σε tablet/κινητό */}
              <span className="smodal__handle" aria-hidden="true" />
              <span className="smodal__eyebrow">Ομιλητές&nbsp; /&nbsp; Βιογραφικό</span>
              <button
                type="button"
                className="smodal__close"
                aria-label="Κλείσιμο"
                onClick={closeModal}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                     strokeLinecap="round" aria-hidden="true">
                  <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />
                </svg>
              </button>
            </div>

            <div className="smodal__body">
              <div className="smodal__portrait">
                <div className="smodal__photo">
                  {activePhoto ? (
                    <img src={activePhoto} alt={active.onoma} />
                  ) : (
                    <span className="speaker__initials">
                      {(active.onoma || '')
                        .split(' ')
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join('')}
                    </span>
                  )}
                </div>
                <div className="smodal__meta">
                  <span className="smodal__type">{rolosGia(active.onoma)}</span>
                  <span className="smodal__count">
                    {String(activeIndex + 1).padStart(2, '0')} /{' '}
                    {String(total).padStart(2, '0')}
                  </span>
                </div>
              </div>

              <div className="smodal__info">
                <div className="smodal__identity">
                  <h3 className="smodal__name">{active.onoma}</h3>
                  {active.idiotita && <p className="smodal__role">{active.idiotita}</p>}
                </div>
                <span className="smodal__divider" aria-hidden="true" />
                <div
                  className="smodal__bio"
                  dangerouslySetInnerHTML={{
                    __html: (active.viografiko || '').replace(/\n/g, '<br/>'),
                  }}
                />
              </div>
            </div>

            {/* Πλοήγηση στον προηγούμενο/επόμενο ομιλητή, χωρίς κλείσιμο */}
            {total > 1 && (
              <div className="smodal__nav">
                <button
                  type="button"
                  className="smodal__navbtn"
                  aria-label="Προηγούμενος ομιλητής"
                  onClick={() => setActiveIndex((i) => (i - 1 + total) % total)}
                >
                  <span className="smodal__navarrow" aria-hidden="true">←</span>
                  {/* Η λέξη κρύβεται σε tablet/κινητό, όπου μένει μόνο το βέλος */}
                  <span className="smodal__navword">Προηγούμενος</span>
                </button>

                <div className="smodal__next">
                  <span className="smodal__next-info">
                    <span className="smodal__next-label">Επόμενος ομιλητής</span>
                    <span className="smodal__next-name">
                      {speakers[(activeIndex + 1) % total]?.onoma}
                    </span>
                  </span>
                  <button
                    type="button"
                    className="smodal__navbtn"
                    aria-label="Επόμενος ομιλητής"
                    onClick={() => setActiveIndex((i) => (i + 1) % total)}
                  >
                    <span className="smodal__navword">Επόμενος</span>
                    <span className="smodal__navarrow" aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
