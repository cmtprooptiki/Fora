'use client';

import { useState, useEffect } from 'react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
function mediaUrl(url) {
  if (!url) return '';
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

export default function Header({ settings, archive = [] }) {
  const logo = settings?.logotypo?.url ? mediaUrl(settings.logotypo.url) : null;
  const [scrolled, setScrolled] = useState(false);

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

        <input type="checkbox" id="nav-toggle" className="nav-toggle" />
        <label htmlFor="nav-toggle" className="nav-burger" aria-label="Μενού">
          <span></span>
          <span></span>
          <span></span>
        </label>

        <nav className="site-nav">
          {archive.length > 0 && (
            <div className="nav-dropdown">
              <button type="button" className="nav-dropdown__toggle" aria-haspopup="true">
                Σχετικά με τα Forum{' '}
                <span className="nav-dropdown__caret" aria-hidden="true">▾</span>
              </button>
              <ul className="nav-dropdown__menu">
                {archive.map((f) => (
                  <li key={f.id}>
                    <a href={`/forum/${f.slug}/`}>Forum {f.etos}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <a href="/#omilites">Ομιλητές</a>
          <a href="/#analytiko-programma">Πρόγραμμα</a>
          <a href="/#newsletter">Νέα &amp; Ανακοινώσεις</a>
        </nav>

        {/* Το CTA είναι ξεχωριστό ώστε το μενού να «απλώνεται» ανάμεσα
            στο λογότυπο (αριστερά) και στο κουμπί (δεξιά) — όπως στο σχέδιο. */}
        <a href="/#epikoinonia" className="btn btn--white site-nav__cta">
          Επικοινωνία
        </a>
      </div>
    </header>
  );
}
