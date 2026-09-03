'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
function mediaUrl(url) {
  if (!url) return '';
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

export default function Header({ settings, archive = [] }) {
  const logo = settings?.logotypo?.url ? mediaUrl(settings.logotypo.url) : null;
  const [scrolled, setScrolled] = useState(false);
  // Σε κινητά/tablet: το «Σχετικά με τα Forum» ανοίγει/κλείνει με κλικ.
  // Στον υπολογιστή το υπομενού συνεχίζει να ανοίγει με hover (CSS).
  const [forumsOpen, setForumsOpen] = useState(false);
  // Το μενού σε κινητά/tablet είναι «ελεγχόμενο» ώστε να κλείνει μόνο του
  // όταν πατηθεί σύνδεσμος (αλλιώς, σε συνδέσμους της ΙΔΙΑΣ σελίδας, θα
  // έμενε ανοιχτό και θα έκρυβε την ενότητα στην οποία πήγαμε).
  const [menuOpen, setMenuOpen] = useState(false);

  // Οι σύνδεσμοι του μενού δείχνουν στις ενότητες ΤΗΣ ΣΕΛΙΔΑΣ ΠΟΥ ΒΛΕΠΟΥΜΕ.
  // Σε σελίδα διοργάνωσης (/forum/forum-2024/) το «Ομιλητές» πάει στους
  // ομιλητές ΕΚΕΙΝΟΥ του Forum, όχι του τρέχοντος.
  const pathname = usePathname() || '/';
  const forumPath = pathname.match(/^\/forum\/[^/]+/);
  const base = forumPath ? `${forumPath[0]}/` : '/';
  const email = settings?.emailEpikoinonias;
  const emailEtaireias = settings?.emailEtaireias;
  const facebook = settings?.facebookUrl;
  const linkedin = settings?.linkedinUrl;
  const youtube = settings?.youtubeUrl;

  // Στο scroll: λευκό φόντο + μαύρα γράμματα. Στην κορυφή: διάφανο + λευκά.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container site-header__inner">
        <a href="/" className="site-header__logo" aria-label="FORA – Αρχική">
          {logo ? (
            <img src={logo} alt="FORA – Innovating Healthcare Management" />
          ) : (
            <span className="site-header__wordmark">FORA</span>
          )}
        </a>

        <input
          type="checkbox"
          id="nav-toggle"
          className="nav-toggle"
          checked={menuOpen}
          onChange={(e) => setMenuOpen(e.target.checked)}
        />
        <label htmlFor="nav-toggle" className="nav-burger" aria-label="Μενού">
          <span></span>
          <span></span>
          <span></span>
        </label>

        <nav className="site-nav" onClick={(e) => {
          // Κλείσιμο του μενού σε κινητά/tablet μόλις πατηθεί σύνδεσμος
          if (e.target.closest('a')) setMenuOpen(false);
        }}>
          {archive.length > 0 && (
            <div className={`nav-dropdown ${forumsOpen ? 'is-open' : ''}`}>
              <button
                type="button"
                className="nav-dropdown__toggle"
                aria-haspopup="true"
                aria-expanded={forumsOpen}
                onClick={() => setForumsOpen((open) => !open)}
              >
                <span className="site-nav__num" aria-hidden="true">01</span>
                <span className="site-nav__label">Σχετικά με τα Forum</span>
                <span className="nav-dropdown__caret" aria-hidden="true">▾</span>
              </button>
              <ul className="nav-dropdown__menu">
                {archive.map((f) => (
                  <li key={f.id}>
                    {/* Το τρέχον Forum οδηγεί στην αρχική σελίδα */}
                    <a href={f.trexonForum ? '/' : `/forum/${f.slug}/`}>Forum {f.etos}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <a href={`${base}#omilites`}>
            <span className="site-nav__num" aria-hidden="true">02</span>
            <span className="site-nav__label">Ομιλητές</span>
          </a>
          <a href={`${base}#analytiko-programma`}>
            <span className="site-nav__num" aria-hidden="true">03</span>
            <span className="site-nav__label">Πρόγραμμα</span>
          </a>
          <a href={`${base}#newsletter`}>
            <span className="site-nav__num" aria-hidden="true">04</span>
            <span className="site-nav__label">Νέα &amp; Ανακοινώσεις</span>
          </a>

          {/* Μόνο σε κινητά/tablet: μπλε μπλοκ με λευκό κουμπί «Επικοινωνία»
              (στον υπολογιστή εμφανίζεται ως κουμπί δεξιά στη μπάρα). */}
          <div className="site-nav__ctawrap">
            <a href={`${base}#epikoinonia`} className="btn btn--white site-nav__cta-m">
              Επικοινωνία
            </a>
          </div>

          {/* Μόνο σε tablet (στο κινητό είναι κρυφό, όπως στο σχέδιο):
              κοινωνικά δίκτυα + στοιχεία επικοινωνίας */}
          {(facebook || linkedin || youtube || email || emailEtaireias) && (
            <div className="site-nav__contact">
              <div className="site-nav__social">
                {linkedin && (
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21H17.6v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.45-2.16 2.96V21H9z" />
                    </svg>
                  </a>
                )}
                {facebook && (
                  <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.87.24-1.46 1.48-1.46h1.58V4.45c-.27-.04-1.2-.11-2.29-.11-2.27 0-3.82 1.38-3.82 3.93v2.23H7.9v3h2.55V21z" />
                    </svg>
                  </a>
                )}
                {youtube && (
                  <a href={youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M10 15.5v-7l6 3.5-6 3.5zM12 4.5c-3.1 0-5.7.2-7.1.4A2.6 2.6 0 0 0 2.7 7c-.2 1.1-.3 2.7-.3 5s.1 3.9.3 5a2.6 2.6 0 0 0 2.2 2.1c1.4.2 4 .4 7.1.4s5.7-.2 7.1-.4A2.6 2.6 0 0 0 21.3 17c.2-1.1.3-2.7.3-5s-.1-3.9-.3-5a2.6 2.6 0 0 0-2.2-2.1c-1.4-.2-4-.4-7.1-.4z" />
                    </svg>
                  </a>
                )}
              </div>

              <div className="site-nav__contactrow">
                {emailEtaireias && (
                  <a className="site-nav__cinfo" href={`mailto:${emailEtaireias}`}>
                    <span className="site-nav__cicon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
                        <path d="M3 6l9 7 9-7" />
                      </svg>
                    </span>
                    {emailEtaireias}
                  </a>
                )}
                {email && (
                  <a className="site-nav__cinfo" href={`mailto:${email}`}>
                    <span className="site-nav__cicon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11z" />
                        <circle cx="12" cy="10" r="2.6" />
                      </svg>
                    </span>
                    {email}
                  </a>
                )}
              </div>
            </div>
          )}
        </nav>

        {/* Το CTA είναι ξεχωριστό ώστε το μενού να «απλώνεται» ανάμεσα
            στο λογότυπο (αριστερά) και στο κουμπί (δεξιά) — όπως στο σχέδιο. */}
        <a href={`${base}#epikoinonia`} className="btn btn--white site-nav__cta">
          Επικοινωνία
        </a>
      </div>
    </header>
  );
}
