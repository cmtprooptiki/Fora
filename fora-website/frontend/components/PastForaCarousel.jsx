'use client';

import { useEffect, useRef, useState } from 'react';
import { mediaUrl } from '../lib/strapi';

// Πόσο μένει κάθε διοργάνωση στην οθόνη πριν περάσει στην επόμενη.
const DIARKEIA = 1500;

// Υπότιτλος κάθε διοργάνωσης, κάτω από τη μπάρα. Κλειδί = ο αριθμός του Forum.
// Το «\n» σπάει τη γραμμή. Αν κάποιο Forum δεν υπάρχει εδώ, εμφανίζεται το
// θέμα του όπως είναι καταχωρημένο στο Strapi.
const YPOTITLOI = {
  1: 'Σύγχρονες μορφές Οργάνωσης & Διοίκησης Νοσοκομειακών Μονάδων',
  2: 'Προκλήσεις στην Οργάνωση & Διοίκηση των Νοσοκομείων',
  3: 'Σταθμός σημαντικών αλλαγών στα νοσοκομεία του ΕΣΥ',
  4: 'Το Νοσοκομείο σε Μετάβαση:\nΓια ένα Νέο Οικοσύστημα\nστη Σύγχρονη Διοίκηση',
};

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
  // Χρόνος που απομένει στην τρέχουσα διοργάνωση. Κρατιέται σε ref ώστε, όταν
  // ο χρήστης σταματήσει προσωρινά την εναλλαγή, να συνεχίσει από εκεί που
  // έμεινε — ακριβώς όπως και η μπάρα, που απλώς «παγώνει».
  const ypoloipoRef = useRef(DIARKEIA);
  const arxiRef = useRef(0);

  // Κάθε φορά που αλλάζει η ενεργή διοργάνωση, ο χρόνος μηδενίζεται.
  // (Τρέχει ΜΕΤΑ το cleanup του επόμενου effect, οπότε δεν «τρώγεται».)
  useEffect(() => {
    ypoloipoRef.current = DIARKEIA;
  }, [active]);

  // Αυτόματη εναλλαγή: κάθε διοργάνωση μένει λίγα δευτερόλεπτα και μετά
  // περνάει στην επόμενη, κυκλικά (…4ο → 1ο → 2ο…).
  useEffect(() => {
    if (total < 2 || paused || !visible) return undefined;
    // Σεβασμός στη ρύθμιση «λιγότερη κίνηση» του λειτουργικού.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    arxiRef.current = Date.now();
    const id = setTimeout(() => {
      setActive((i) => (i + 1) % total);
    }, ypoloipoRef.current);

    return () => {
      clearTimeout(id);
      // Αν σταματήσαμε λόγω παύσης, κρατάμε τον χρόνο που απέμεινε.
      const perase = Date.now() - arxiRef.current;
      ypoloipoRef.current = Math.max(400, ypoloipoRef.current - perase);
    };
  }, [active, total, paused, visible]);

  // Ξεκινάει μόνο όταν η ενότητα μπει στο οπτικό πεδίο.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    // Χωρίς κατώφλι ποσοστού (η ενότητα μπορεί να είναι ψηλότερη από την
    // οθόνη): μετράει αν πιάνει το μεσαίο 70% του παραθύρου.
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '-15% 0px -15% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (total === 0) return null;

  // «Τρέχει» = η μπάρα μικραίνει. Όταν είναι 0, η μπάρα παγώνει εκεί που βρίσκεται
  // (εκτός οθόνης, με τον δείκτη πάνω στους επιλογείς, ή με μία μόνο διοργάνωση).
  const running = total > 1 && visible && !paused;

  return (
    <section
      className="istoria"
      id="proigoumena-fora"
      ref={sectionRef}
      data-running={running ? '1' : '0'}
      style={{ '--istoria-dur': `${DIARKEIA}ms` }}
    >
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
          {past.map((f, i) => {
            const ypotitlos = YPOTITLOI[f.arithmos] || f.thema;
            return (
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
                {ypotitlos && (
                  <span className="istoria__tab-sub">
                    {String(ypotitlos)
                      .split('\n')
                      .map((line, j) => (
                        <span className="istoria__tab-subline" key={j}>
                          {line}
                        </span>
                      ))}
                  </span>
                )}
              </a>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
