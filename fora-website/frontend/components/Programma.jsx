'use client';

import { useState } from 'react';

// Μικρά εικονίδια (γραμμικά) σε στυλ Figma
const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="3" y="4.5" width="18" height="16" rx="2" />
    <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
  </svg>
);
const IconPeople = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="8" r="3.2" />
    <path d="M2.8 19c0-3 2.8-5.2 6.2-5.2S15.2 16 15.2 19" />
    <path d="M16.2 5.4a3 3 0 0 1 0 5.7M21.2 19c0-2.2-1-3.9-2.6-4.8" />
  </svg>
);
const IconPerson = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="3.4" />
    <path d="M5 20c0-3.4 3.1-6 7-6s7 2.6 7 6" />
  </svg>
);

export default function Programma({ forum }) {
  const sessions = forum?.programma || [];
  // Μόνο μία ενότητα ανοιχτή κάθε φορά (η 1η αρχικά)
  const [openIndex, setOpenIndex] = useState(0);

  if (sessions.length === 0) return null;

  const toggle = (i) => setOpenIndex((prev) => (prev === i ? -1 : i));

  return (
    <section className="section programma" id="analytiko-programma">
      <div className="container">
        <div className="section__head">
          <span className="section__eyebrow">Πρόγραμμα</span>
          <h2>Αναλυτικό Πρόγραμμα</h2>
          {forum?.imerominia && (
            <p className="prog__date">
              <IconCalendar />
              {forum.imerominia}
            </p>
          )}
        </div>

        <div className="prog">
          {sessions.map((s, i) => {
            const isOpen = openIndex === i;
            const items = s.stoixeia || [];
            return (
              <div className={`prog__group ${isOpen ? 'is-open' : ''}`} key={i}>
                <button
                  type="button"
                  className="prog__head"
                  aria-expanded={isOpen}
                  onClick={() => toggle(i)}
                >
                  <span className="prog__num">{i + 1}</span>
                  <span className="prog__head-title">
                    Ενότητα {i + 1}: {s.titlos}
                  </span>
                  <span className="prog__head-meta">
                    {s.xronikoBlok && <span className="prog__head-time">{s.xronikoBlok}</span>}
                    <span className="prog__chev" aria-hidden="true" />
                  </span>
                </button>

                {isOpen && (
                  <div className="prog__body">
                    {s.syntonistis && (
                      <p className="prog__coord">
                        <IconPeople />
                        Συντονιστής: {s.syntonistis}
                      </p>
                    )}
                    <ul className="prog__items">
                      {items.map((it, j) => {
                        const isBreak = it.typos === 'Διάλειμμα';
                        const showTag = it.typos && it.typos !== 'Ομιλία';
                        return (
                          <li className="prog__item" key={j}>
                            <span className="prog__item-titlerow">
                              {it.ora && <span className="prog__item-time">{it.ora}</span>}
                              <span className="prog__item-title">{it.titlos}</span>
                              {showTag && (
                                <span className={`prog__pill ${isBreak ? '' : 'prog__pill--muted'}`}>
                                  {it.typos}
                                </span>
                              )}
                            </span>
                            {it.omilitis && (
                              <span className="prog__item-desc">
                                <IconPerson />
                                <span>
                                  {it.omilitis}
                                  {it.idiotita ? ` · ${it.idiotita}` : ''}
                                </span>
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
