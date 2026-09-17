import { mediaUrl } from '../lib/strapi';

export default function Sponsors({ forum }) {
  const groups = forum?.synergates || [];
  // «Υπό διαμόρφωση» — ίδιο πεδίο με τη λωρίδα κορυφής και την υποσημείωση
  // στους ομιλητές, ώστε όλα τα μηνύματα προσχεδίου να κλείνουν μαζί.
  const isDraft = !!forum?.mynimaKorifis?.trim();
  if (groups.length === 0) return null;

  return (
    <section className="section" id="synergates">
      <div className="container">
        <div className="section__head">
          <h2>Συνεργάτες του Forum</h2>
          <p className="section__intro">
            Μαζί διαμορφώνουμε το μέλλον της υγείας, με τη στήριξη επιστημονικών
            φορέων, οργανισμών και εταιρειών.
          </p>
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
