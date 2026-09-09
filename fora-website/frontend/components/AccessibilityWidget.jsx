'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Πλωτό κουμπί προσβασιμότητας (κάτω δεξιά) με πάνελ ρυθμίσεων.
//
// Οι ρυθμίσεις γράφονται ως data-attributes στο <html> και υλοποιούνται στο
// globals.css. Έτσι δεν χρειάζεται να «περπατήσουμε» το DOM και οι επιλογές
// ισχύουν αμέσως σε όλη τη σελίδα.
//
// Η μεγέθυνση γίνεται με «zoom» στο <main> και στο υποσέλιδο — ΟΧΙ στο <html>,
// γιατί το στυλ του ιστότοπου έχει πολλά μεγέθη σε px (και clamp) που δεν θα
// άλλαζαν με font-size στη ρίζα. Η μπάρα πλοήγησης μένει εκτός επίτηδες:
// είναι position:fixed και το zoom θα χαλούσε τη θέση της.

const KEY = 'fora-a11y';
const DEFAULTS = {
  step: 0, // -2 … +4  →  ζουμ 0.9 … 1.4
  spacing: false,
  contrast: null, // 'high' | 'invert' | null
  grayscale: false,
  links: false,
  font: false,
  motion: false,
};

const ZOOM_PER_STEP = 0.1;
const MIN_STEP = -2;
const MAX_STEP = 4;

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [s, setS] = useState(DEFAULTS);
  const panelRef = useRef(null);
  const fabRef = useRef(null);

  // --- Εφαρμογή των ρυθμίσεων στο <html> ---
  const apply = useCallback((next) => {
    const el = document.documentElement;
    const attr = (name, value) =>
      value ? el.setAttribute(name, value) : el.removeAttribute(name);

    el.style.setProperty('--a11y-zoom', String(1 + next.step * ZOOM_PER_STEP));
    attr('data-a11y-zoom', next.step !== 0 ? 'on' : null);
    attr('data-a11y-spacing', next.spacing ? 'on' : null);
    attr('data-a11y-contrast', next.contrast);
    attr('data-a11y-grayscale', next.grayscale ? 'on' : null);
    attr('data-a11y-links', next.links ? 'on' : null);
    attr('data-a11y-font', next.font ? 'readable' : null);
    attr('data-a11y-motion', next.motion ? 'off' : null);

    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ιδιωτική περιήγηση: απλώς δεν θυμόμαστε την επιλογή */
    }
  }, []);

  // Οι αποθηκευμένες επιλογές διαβάζονται ΜΕΤΑ τη φόρτωση, ώστε το HTML του
  // διακομιστή και του περιηγητή να είναι ίδια (αλλιώς σφάλμα ενυδάτωσης).
  useEffect(() => {
    let saved = null;
    try {
      saved = JSON.parse(window.localStorage.getItem(KEY) || 'null');
    } catch {
      saved = null;
    }
    const next = { ...DEFAULTS, ...(saved || {}) };
    setS(next);
    apply(next);
  }, [apply]);

  const update = (patch) => {
    setS((prev) => {
      const next = { ...prev, ...patch };
      apply(next);
      return next;
    });
  };

  const reset = () => {
    setS(DEFAULTS);
    apply(DEFAULTS);
  };

  // Κλείσιμο με Escape και με κλικ έξω από το πάνελ
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        fabRef.current?.focus();
      }
    };
    const onDown = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        !fabRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [open]);

  // Με το άνοιγμα, η εστίαση πάει στο πρώτο κουμπί του πάνελ
  useEffect(() => {
    if (open) panelRef.current?.querySelector('.a11y-item')?.focus();
  }, [open]);

  const Item = ({ act, icon, label, pressed, onClick }) => (
    <li>
      <button
        type="button"
        className="a11y-item"
        data-act={act}
        {...(pressed === undefined ? {} : { 'aria-pressed': pressed })}
        onClick={onClick}
      >
        <span className="a11y-item__ic" aria-hidden="true">{icon}</span>
        {label}
      </button>
    </li>
  );

  return (
    <>
      <button
        ref={fabRef}
        type="button"
        className="a11y-fab"
        aria-expanded={open}
        aria-controls="a11y-panel"
        aria-label="Επιλογές προσβασιμότητας"
        onClick={() => setOpen((o) => !o)}
      >
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <circle cx="20" cy="20" r="16.6" fill="none" stroke="currentColor" strokeWidth="2.6" />
          <circle cx="20" cy="12.4" r="2.5" fill="currentColor" />
          <path
            fill="currentColor"
            d="M28.6 17.1a1.35 1.35 0 0 0-1.6-1.06l-5.1 1.02a9 9 0 0 1-3.8 0l-5.1-1.02a1.35 1.35 0 1 0-.53 2.65l4.4.88v3.05l-2.06 7.4a1.35 1.35 0 0 0 2.6.73l1.86-6.6h1.86l1.86 6.6a1.35 1.35 0 0 0 2.6-.73l-2.06-7.4V19.57l4.4-.88c.73-.15 1.2-.86 1.05-1.6z"
          />
        </svg>
      </button>

      <div
        id="a11y-panel"
        ref={panelRef}
        className="a11y-panel"
        data-open={open ? 'true' : 'false'}
        role="dialog"
        aria-label="Επιλογές προσβασιμότητας"
      >
        <div className="a11y-panel__head">
          <h2>Προσβασιμότητα</h2>
          <button
            type="button"
            className="a11y-panel__close"
            aria-label="Κλείσιμο"
            onClick={() => {
              setOpen(false);
              fabRef.current?.focus();
            }}
          >
            ×
          </button>
        </div>

        <ul className="a11y-list">
          <Item
            act="bigger"
            icon="A+"
            label="Μεγαλύτερα γράμματα"
            onClick={() => update({ step: Math.min(s.step + 1, MAX_STEP) })}
          />
          <Item
            act="smaller"
            icon="A−"
            label="Μικρότερα γράμματα"
            onClick={() => update({ step: Math.max(s.step - 1, MIN_STEP) })}
          />
          <Item
            act="spacing"
            icon="↕"
            label="Μεγαλύτερα διαστήματα"
            pressed={s.spacing}
            onClick={() => update({ spacing: !s.spacing })}
          />
          <Item
            act="contrast-high"
            icon="◐"
            label="Υψηλή αντίθεση"
            pressed={s.contrast === 'high'}
            onClick={() => update({ contrast: s.contrast === 'high' ? null : 'high' })}
          />
          <Item
            act="contrast-invert"
            icon="◑"
            label="Αντιστροφή χρωμάτων"
            pressed={s.contrast === 'invert'}
            onClick={() => update({ contrast: s.contrast === 'invert' ? null : 'invert' })}
          />
          <Item
            act="grayscale"
            icon="▦"
            label="Ασπρόμαυρο"
            pressed={s.grayscale}
            onClick={() => update({ grayscale: !s.grayscale })}
          />
          <Item
            act="links"
            icon="A̲"
            label="Υπογράμμιση συνδέσμων"
            pressed={s.links}
            onClick={() => update({ links: !s.links })}
          />
          <Item
            act="font"
            icon="Aa"
            label="Αναγνώσιμη γραμματοσειρά"
            pressed={s.font}
            onClick={() => update({ font: !s.font })}
          />
          <Item
            act="motion"
            icon="⏸"
            label="Παύση κινήσεων"
            pressed={s.motion}
            onClick={() => update({ motion: !s.motion })}
          />
        </ul>

        <button type="button" className="a11y-item a11y-reset" onClick={reset}>
          <span className="a11y-item__ic" aria-hidden="true">⟲</span>
          Επαναφορά
        </button>
      </div>
    </>
  );
}
