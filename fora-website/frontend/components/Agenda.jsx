import { mediaUrl } from '../lib/strapi';

export default function Agenda({ forum }) {
  const pdf = forum?.atzentaPdf?.url ? mediaUrl(forum.atzentaPdf.url) : null;
  const reg = forum?.syndesmoEggrafis;

  return (
    <section className="section" id="programma">
      <div className="container">
        <div className="agenda">
          <span className="section__eyebrow">Ατζέντα</span>
          <h2>Το πρόγραμμα του Forum</h2>
          <p className="section__intro">
            {forum?.imerominia ? `${forum.imerominia}. ` : ''}
            {forum?.xoros}
          </p>
          <div className="agenda__actions">
            {pdf ? (
              <a href={pdf} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
                Κατεβάστε την αναλυτική Ατζέντα (PDF)
              </a>
            ) : (
              <p className="agenda__soon">Η αναλυτική ατζέντα θα ανακοινωθεί σύντομα.</p>
            )}
            {reg && (
              <a href={reg} target="_blank" rel="noopener noreferrer" className="btn btn--outline">
                Εγγραφή στο Forum
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
