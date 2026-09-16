'use client';

import { useEffect, useState } from 'react';

// Αναδυόμενο παράθυρο με αντίστροφη μέτρηση για τη διοργάνωση.
//
// Εμφανίζεται ΜΙΑ ΦΟΡΑ ανά επίσκεψη (sessionStorage): ο ιστότοπος αλλάζει
// σελίδα με πλήρη φόρτωση, οπότε χωρίς αυτό το popup θα ξαναέβγαινε σε κάθε
// κλικ του μενού. Κλείνοντας τον browser και ξαναμπαίνοντας, εμφανίζεται πάλι.
//
// Δεν εμφανίζεται καθόλου αν δεν υπάρχει ημερομηνία έναρξης ή αν έχει περάσει.

const KEY = 'fora-countdown-seen';

function diff(target) {
  const ms = target - Date.now();
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

const pad = (n) => String(n).padStart(2, '0');

export default function CountdownPopup({
  arithmos,
  targetIso,
  imerominia,
  xoros,
  registerHref,
}) {
  const [open, setOpen] = useState(false);
  const [left, setLeft] = useState(null);

  useEffect(() => {
    if (!targetIso) return undefined;
    const target = new Date(targetIso).getTime();
    if (Number.isNaN(target)) return undefined;

    const first = diff(target);
    if (!first) return undefined; // η εκδήλωση έχει ήδη γίνει

    let seen = null;
    try {
      seen = window.sessionStorage.getItem(KEY);
    } catch {
      seen = null;
    }
    if (seen) return undefined;

    setLeft(first);
    setOpen(true);

    const id = setInterval(() => {
      const next = diff(target);
      if (!next) {
        setOpen(false);
        clearInterval(id);
        return;
      }
      setLeft(next);
    }, 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  const close = () => {
    setOpen(false);
    try {
      window.sessionStorage.setItem(KEY, '1');
    } catch {
      /* ιδιωτική περιήγηση */
    }
  };

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open || !left) return null;

  const boxes = [
    { n: left.d, label: 'ΗΜΕΡΕΣ' },
    { n: left.h, label: 'ΩΡΕΣ' },
    { n: left.m, label: 'ΛΕΠΤΑ' },
    { n: left.s, label: 'ΔΕΥΤΕΡΟΛΕΠΤΑ' },
  ];

  return (
    <div className="cdp-overlay" onClick={close}>
      <div
        className="cdp"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cdp-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="cdp__close" aria-label="Κλείσιμο" onClick={close}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
               strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="cdp__body">
          <h2 className="cdp__title" id="cdp-title">
            Μην χάσετε το
            <br />
            <strong>
              {arithmos ? `${arithmos}ο ` : ''}Υβριδικό Forum!
            </strong>
          </h2>

          <p className="cdp__pill">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
                 strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 12.5l5 5L20 6.5" />
            </svg>
            Οι εγγραφές είναι ανοιχτές.
          </p>

          <p className="cdp__sub">
            Δηλώστε συμμετοχή και παρακολουθήστε από κοντά μια ουσιαστική συνάντηση
            για τις σύγχρονες προκλήσεις και εξελίξεις στη διοίκηση νοσοκομείων.
          </p>

          <div className="cdp__timer">
            {boxes.map((b) => (
              <div className="cdp__box" key={b.label}>
                <span className="cdp__num">{pad(b.n)}</span>
                <span className="cdp__label">{b.label}</span>
              </div>
            ))}
          </div>

          {(imerominia || xoros) && (
            <p className="cdp__details">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"
                   strokeLinecap="round" aria-hidden="true">
                <rect x="3" y="4.5" width="18" height="16" rx="2" />
                <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
              </svg>
              {[imerominia, xoros].filter(Boolean).join(' • ')}
            </p>
          )}
        </div>

        <div className="cdp__actions">
          <a
            className="cdp__cta"
            href={registerHref || '#'}
            {...(registerHref ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            Δηλώστε συμμετοχή
          </a>
        </div>
      </div>
    </div>
  );
}
