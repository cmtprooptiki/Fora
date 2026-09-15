'use client';

import { useState, useEffect } from 'react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
function mediaUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${STRAPI_URL}${url}`;
}

export default function Speakers({ forum }) {
  const speakers = forum?.omilites || [];
  const [active, setActive] = useState(null); // ο επιλεγμένος ομιλητής (ή null)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setActive(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

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
            const hasBio = !!(sp.viografiko && sp.viografiko.trim());

            const inner = (
              <>
                <div className="speaker__photo">
                  {photo ? (
                    <img src={photo} alt={sp.onoma} loading="lazy" />
                  ) : (
                    <span className="speaker__initials">{initials}</span>
                  )}
                </div>
                <h3 className="speaker__name">{sp.onoma}</h3>
                {sp.idiotita && <p className="speaker__title">{sp.idiotita}</p>}
                {hasBio && <span className="speaker__more">Δείτε το βιογραφικό →</span>}
              </>
            );

            return hasBio ? (
              <div
                className="speaker speaker--clickable"
                key={i}
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                onClick={() => setActive(sp)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActive(sp);
                  }
                }}
              >
                {inner}
              </div>
            ) : (
              <article className="speaker" key={i}>
                {inner}
              </article>
            );
          })}
        </div>
        )}
      </div>

      {active && (
        <div
          className="smodal-overlay"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Βιογραφικό: ${active.onoma}`}
        >
          <div className="smodal" onClick={(e) => e.stopPropagation()}>
            <button className="smodal__close" aria-label="Κλείσιμο" onClick={() => setActive(null)}>
              ×
            </button>
            <div className="smodal__head">
              {activePhoto && <img className="smodal__photo" src={activePhoto} alt={active.onoma} />}
              <div>
                <h3 className="smodal__name">{active.onoma}</h3>
                {active.idiotita && <p className="smodal__title">{active.idiotita}</p>}
              </div>
            </div>
            <div
              className="smodal__bio"
              dangerouslySetInnerHTML={{ __html: active.viografiko.replace(/\n/g, '<br/>') }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
