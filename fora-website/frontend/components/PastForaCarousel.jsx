'use client';

import { useEffect, useRef, useState } from 'react';
import { mediaUrl } from '../lib/strapi';

// Πόσο μένει κάθε διοργάνωση στην οθόνη πριν περάσει στην επόμενη.
const DIARKEIA = 4500;

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
  // Η εναλλαγή «παγώνει» όσο ο χρήστης δείχνει/εστιάζει στους επιλογείς…
  const [paused, setPaused] = useState(false);
  // …και όσο η ενότητα δεν φαίνεται στην οθόνη.
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const total = past.length;

  // Αυτόματη εναλλαγή: κάθε διοργάνωση μένει λίγα δευτερόλεπτα και μετά
  // περνάει στην επόμενη, κυκλικά (…4ο → 1ο → 2ο…).
  useEffect(() => {
    if (total < 2 || paused || !visible) return undefined;
    // Σεβασμός στη ρύθμιση «λιγότερη κίνηση» του λειτουργικού.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }
    const id = setInterval(() => {
      setActive((i) => (i + 1) % total);
    }, DIARKEIA);
    return () => clearInterval(id);
  }, [total, paused, visible]);

  // Ξεκινάει μόνο όταν η ενότητα μπει στο οπτικό πεδίο.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (total === 0) return null;

  return (
    <section className="istoria" id="proigoumena-fora" ref={sectionRef}>
      {/* Μία στρώση φόντου ανά διοργάνωση: η ενεργή γίνεται ορατή και οι
          υπόλοιπες σβήνουν, ώστε η αλλαγή να γίνεται με ομαλό σβήσιμο αντί
          για απότομη εναλλαγή εικόνας. */}
      {past.map((f, i) => {
        const bg = bgFor(f);
        return (
          <div
            key={f.id}
            className="istoria__bg"
            style={{
              ...(bg ? { backgroundImage: `url(${bg})` } : null),
              opacity: i === active ? 1 : 0,
            }}
            aria-hidden="true"
          />
        );
      })}
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
        <nav
          className="istoria__tabs"
          aria-label="Προηγούμενα Fora"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
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
