'use client';

import { useState } from 'react';
import { mediaUrl } from '../lib/strapi';

// Εικόνα φόντου ανά διοργάνωση: πρώτα η εικόνα κεφαλίδας (φωτογραφία), μετά η
// 1η φωτογραφία της γκαλερί και τέλος η ειδική «eikonaKarouzel».
function bgFor(f) {
  const u =
    f?.eikonaHero?.url ||
    f?.fotografies?.[0]?.url ||
    f?.eikonaKarouzel?.url ||
    null;
  return u ? mediaUrl(u) : null;
}

const INTRO =
  'Από το 2022 έως σήμερα, τα Fora εξελίσσονται σε θεσμό που ενώνει διοίκηση, επιστήμη και αγορά, με στόχο εφαρμόσιμες λύσεις στη νοσοκομειακή φροντίδα.';

export default function PastForaCarousel({ forums = [], title = 'Η Ιστορία\nτου Forum' }) {
  // Μόνο τα προηγούμενα (όχι το τρέχον), ταξινομημένα 1ο → τελευταίο.
  const past = (forums || [])
    .filter((f) => !f.trexonForum)
    .slice()
    .sort((a, b) => (a.etos || a.arithmos || 0) - (b.etos || b.arithmos || 0));

  const [active, setActive] = useState(0);
  if (past.length === 0) return null;

  const current = past[active];
  const bg = bgFor(current);

  return (
    <section className="istoria" id="proigoumena-fora">
      <div
        className="istoria__bg"
        style={bg ? { backgroundImage: `url(${bg})` } : undefined}
        aria-hidden="true"
      />
      <div className="istoria__overlay" aria-hidden="true" />

      <div className="container istoria__inner">
        <div className="istoria__top">
          <div className="istoria__head">
            <h2 className="istoria__title">
              {title.split('\n').map((line, i) => (
                <span key={i}>{line}</span>
              ))}
            </h2>
            <p className="istoria__intro">{INTRO}</p>
          </div>
          <span className="istoria__eyebrow" aria-hidden="true">
            Mini
            <br />
            Spotlight
          </span>
        </div>

        {/* Επιλογείς διοργανώσεων — κάθε στοιχείο πάει στη σελίδα του Forum
            και αλλάζει την εικόνα φόντου όταν το δείχνει ο χρήστης. */}
        <nav className="istoria__tabs" aria-label="Προηγούμενα Fora">
          {past.map((f, i) => (
            <a
              key={f.id}
              href={`/forum/${f.slug}/`}
              className={`istoria__tab ${i === active ? 'is-active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className="istoria__tab-title">
                {f.arithmos ? (
                  <>
                    {f.arithmos}
                    <sup>ο</sup>
                  </>
                ) : null}{' '}
                FORUM — {f.etos}
              </span>
              {f.thema && <span className="istoria__tab-sub">{f.thema}</span>}
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
