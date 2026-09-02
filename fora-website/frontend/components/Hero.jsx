import { mediaUrl } from '../lib/strapi';
import HeroBubbles from './HeroBubbles';
import StatNumber from './StatNumber';

export default function Hero({ forum, backHref, backLabel }) {
  const heroImg = forum?.eikonaHero?.url ? mediaUrl(forum.eikonaHero.url) : null;
  const reg = forum?.syndesmoEggrafis;
  const stats = forum?.arithmoi || [];
  const intro = forum?.paragrafosKefalidas;
  const introBtnText = forum?.koumpiKefalidasKeimeno;
  // Προτεραιότητα: αν έχει ανέβει PDF, το κουμπί το κατεβάζει· αλλιώς πάει στον σύνδεσμο.
  const introBtnPdf = forum?.koumpiKefalidasPdf?.url ? mediaUrl(forum.koumpiKefalidasPdf.url) : null;
  const introBtnHref = introBtnPdf || forum?.koumpiKefalidasSyndesmos;
  // Έντονη γραφή στην επωνυμία «Forum for Innovating Healthcare Management».
  const introHtml = intro
    ? intro.replace(
        /Forum for Innovating Healthcare Management/g,
        '<strong>Forum for Innovating Healthcare Management</strong>'
      )
    : '';
  // Στα προηγούμενα Fora το κουμπί «Ατζέντα» γίνεται λευκό (όπως το «Εγγραφή»).
  const isPast = !forum?.trexonForum;
  // Οι φυσαλίδες («μπάλες») εμφανίζονται σε κάθε Forum.
  const showBubbles = true;

  return (
    <section className={`hero ${showBubbles ? 'hero--bubbles' : ''}`}>
      {showBubbles && <HeroBubbles />}

      <div className="container hero__inner">
        <div className="hero__left">
          {backHref && (
            <a href={backHref} className="hero__back">
              {backLabel || '← Πίσω'}
            </a>
          )}
          <p className="hero__edition">
            {forum?.arithmos ? (
              <span className="hero__edition-no">
                {forum.arithmos}
                <sup className="hero__edition-ord">ο</sup>
              </span>
            ) : null}{' '}
            <span className="hero__edition-txt">Υβριδικό Forum</span>
          </p>
          <h1 className="hero__title">{forum?.thema}</h1>

          <div className="hero__actions" id="eggrafi">
            {reg && (
              <a href={reg} target="_blank" rel="noopener noreferrer" className="btn btn--white">
                Εγγραφή
              </a>
            )}
            <a
              href="#analytiko-programma"
              className={
                isPast ? 'btn hero__agenda-solid' : 'btn btn--outline hero__agenda'
              }
            >
              Ατζέντα
            </a>
          </div>
        </div>

        <div className="hero__right">
          {forum?.ypotitlos && <p className="hero__tagline">{forum.ypotitlos}</p>}
          <div className="hero__meta">
            {forum?.imerominia && <p className="hero__date">{forum.imerominia}</p>}
            {forum?.xoros && <p className="hero__place">{forum.xoros}</p>}
          </div>
        </div>

      </div>

      {/* Αριθμοί + παράγραφος: ΚΑΤΩ από την κεφαλίδα πλήρους ύψους,
          ώστε η κεφαλίδα να μένει καθαρή (όπως στο σχέδιο). */}
      {(stats.length > 0 || intro || introBtnText) && (
        <div className="container hero__below">
          {stats.length > 0 && (
            <div className="hero__stats">
              {stats.map((s, i) => (
                <div className="hero-stat" key={i}>
                  <StatNumber
                    className="hero-stat__num"
                    value={(() => {
                      // Το 1ο πάντα με «+», τα υπόλοιπα χωρίς.
                      const stripped = String(s.arithmos || '').replace(/\+\s*$/, '');
                      return i === 0 && stripped ? `${stripped}+` : stripped;
                    })()}
                  />
                  <span className="hero-stat__desc">{s.perigrafi}</span>
                </div>
              ))}
            </div>
          )}

          {intro && (
            <p
              className="hero__intro-para"
              dangerouslySetInnerHTML={{ __html: introHtml }}
            />
          )}

          {introBtnText && (
            <div className="hero__intro-btnwrap">
              <a
                href={introBtnHref || '#'}
                className="btn hero__agenda-solid hero__intro-btn"
                {...(introBtnPdf
                  ? { download: '', target: '_blank', rel: 'noopener noreferrer' }
                  : introBtnHref && /^https?:\/\//.test(introBtnHref)
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
              >
                {introBtnText}
              </a>
            </div>
          )}
        </div>
      )}

      {/* Αν υπάρχει εικόνα κεφαλίδας και δεν χρησιμοποιούμε φυσαλίδες, τη δείχνουμε ως φόντο. */}
      {!showBubbles && heroImg && (
        <img className="hero__img-bg" src={heroImg} alt="" aria-hidden="true" />
      )}
    </section>
  );
}
