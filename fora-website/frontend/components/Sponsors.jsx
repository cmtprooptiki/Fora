import { mediaUrl } from '../lib/strapi';

export default function Sponsors({ forum }) {
  const groups = forum?.synergates || [];
  // «Υπό διαμόρφωση» — ίδιο πεδίο με τη λωρίδα κορυφής και την υποσημείωση
  // στους ομιλητές, ώστε όλα τα μηνύματα προσχεδίου να κλείνουν μαζί.
  const isDraft = !!forum?.mynimaKorifis?.trim();
  // Ο αριθμός της διοργάνωσης στην εισαγωγή («Το 5ο Υβριδικό Forum…»)
  const arithmos = forum?.arithmos;
  if (groups.length === 0) return null;

  return (
    <section className="section" id="synergates">
      <div className="container">
        <div className="section__head">
          <h2 className="prog__title">
            <span>Συνεργάτες</span>
            <span>του Forum</span>
          </h2>
          {/* Εισαγωγή (Figma «Frame 14»): η παράγραφος πιάνει μόνο το αριστερό
              μισό και δεξιά μπαίνει το σλόγκαν σε πλαίσιο, με διακοσμητικό τόξο. */}
          <div className="syn__lead">
            <p className="syn__intro">
              Το {arithmos}
              <sup className="ordinal">ο</sup> Υβριδικό Forum δε θα ήταν δυνατό χωρίς τη
              στήριξη και τη συνεργασία επιστημονικών φορέων, οργανισμών και εταιρειών
              που συμβάλλουν ενεργά στην εξέλιξη της νοσοκομειακής φροντίδας.
            </p>

            <div className="syn__slogan">
              <span className="syn__slogan-arc" aria-hidden="true">
                <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient
                      id="foraSynArc"
                      x1="0"
                      y1="90"
                      x2="180"
                      y2="90"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0" stopColor="#0d4f9f" stopOpacity="0.85" />
                      <stop offset="0.4" stopColor="#11c0ea" stopOpacity="0.6" />
                      <stop offset="0.75" stopColor="#11c0ea" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <circle cx="90" cy="90" r="89" stroke="url(#foraSynArc)" strokeWidth="1.5" />
                </svg>
              </span>
              <p className="syn__slogan-text">Μαζί διαμορφώνουμε το μέλλον της υγείας</p>
            </div>
          </div>
        </div>

        {groups.map((group, gi) => (
          <div className="sponsor-group" key={gi}>
            <h3 className="sponsor-group__title">{group.katigoria}</h3>
            <div className="sponsor-group__logos">
              {(group.logotypa || []).map((s, si) => {
                const logo = s.logotypo?.url ? mediaUrl(s.logotypo.url) : null;
                const inner = logo ? (
                  <img src={logo} alt={s.onoma || group.katigoria} loading="lazy" />
                ) : (
                  <span>{s.onoma}</span>
                );
                return (
                  <div className="sponsor-logo" title={s.onoma || ''} key={si}>
                    {s.istoselida ? (
                      <a href={s.istoselida} target="_blank" rel="noopener noreferrer">
                        {inner}
                      </a>
                    ) : (
                      inner
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Υποσημείωση προσχεδίου, κάτω από τις κατηγορίες και τα λογότυπα.
            Ίδιος διακόπτης με τα υπόλοιπα μηνύματα «υπό διαμόρφωση»: εμφανίζεται
            όσο έχει κείμενο το «Μήνυμα Κορυφής» (mynimaKorifis) στο Strapi. */}
        {isDraft && (
          <p className="draft-note draft-note--start">
            <span className="draft-note__star" aria-hidden="true">*</span>
            Οι παρακάτω συνεργάτες έχουν ήδη επιβεβαιωθεί, ενώ η ενότητα θα
            επικαιροποιείται σταδιακά με νέες αιγίδες, επιστημονικούς υποστηρικτές
            και χορηγούς της διοργάνωσης.
          </p>
        )}
      </div>
    </section>
  );
}
