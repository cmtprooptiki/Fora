import { getArticles, mediaUrl } from '../../lib/strapi';
import NewsGrid from '../../components/NewsGrid';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Νέα & Ανακοινώσεις | FORA',
  description:
    'Ενημερωθείτε πρώτοι για όλα τα νέα και τις ανακοινώσεις που αφορούν όλα τα Forum μας.',
};

// Μορφοποίηση ημερομηνίας στα ελληνικά, π.χ. «5 Νοεμβρίου 2025».
const MINES = [
  'Ιανουαρίου', 'Φεβρουαρίου', 'Μαρτίου', 'Απριλίου', 'Μαΐου', 'Ιουνίου',
  'Ιουλίου', 'Αυγούστου', 'Σεπτεμβρίου', 'Οκτωβρίου', 'Νοεμβρίου', 'Δεκεμβρίου',
];
// (χωρίς export: τα αρχεία σελίδας του Next.js δέχονται μόνο συγκεκριμένα
// ονόματα εξαγωγής — ένα επιπλέον named export χαλάει το build)
function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getDate()} ${MINES[d.getMonth()]} ${d.getFullYear()}`;
}

export default async function NewsPage() {
  const articles = await getArticles();

  // Προβεβλημένο άρθρο: αυτό με τον διακόπτη «proveblimeno», αλλιώς το νεότερο.
  const featured = articles.find((a) => a.proveblimeno) || articles[0] || null;
  const rest = featured ? articles.filter((a) => a.id !== featured.id) : articles;

  const featImg = featured?.eikona?.url ? mediaUrl(featured.eikona.url) : null;

  return (
    <>
      {/* Κεφαλίδα σελίδας */}
      <section className="nws-hero">
        <div className="container nws-hero__inner">
          <nav className="nws-crumbs" aria-label="Διαδρομή">
            <a href="/">Αρχική</a>
            <span aria-hidden="true">›</span>
            <span className="nws-crumbs__current">Νέα &amp; Ανακοινώσεις</span>
          </nav>
          <h1 className="nws-hero__title">Νέα &amp; Ανακοινώσεις</h1>
          <p className="nws-hero__sub">
            Ενημερωθείτε πρώτοι για όλα τα νέα και τις ανακοινώσεις που αφορούν όλα τα
            Forum μας.
          </p>
        </div>
      </section>

      {articles.length === 0 ? (
        <section className="section">
          <div className="container">
            <p className="thematics__intro">
              Δεν υπάρχουν ακόμη δημοσιευμένα νέα. Προσθέστε άρθρα από τον πίνακα
              διαχείρισης.
            </p>
          </div>
        </section>
      ) : (
        <>
          {/* ΠΡΟΣΦΑΤΑ ΝΕΑ — προβεβλημένο άρθρο */}
          {featured && (
            <section className="section nws-featured">
              <div className="container">
                <div className="thematics__head">
                  <span>Πρόσφατα</span>
                  <span>Νέα</span>
                </div>

                <article className="nws-feat">
                  {featImg && (
                    <img className="nws-feat__img" src={featImg} alt={featured.titlos} />
                  )}
                  <div className="nws-feat__body">
                    <div className="nws-meta">
                      <span className="nws-meta__date">{formatDate(featured.imerominia)}</span>
                      <span className="nws-tag nws-tag--solid">
                        {(featured.katigoria || 'Νέα').toUpperCase()}
                      </span>
                    </div>
                    <h2 className="nws-feat__title">{featured.titlos}</h2>
                    {featured.perilipsi && (
                      <p className="nws-feat__sum">{featured.perilipsi}</p>
                    )}
                    <div className="nws-feat__action">
                      <a className="nws-btn" href={`/news/${featured.slug}/`}>
                        Διαβάστε το άρθρο
                      </a>
                      {featured.xronosAnagnosis ? (
                        <span className="nws-feat__time">
                          Χρόνος ανάγνωσης: {featured.xronosAnagnosis} λεπτά
                        </span>
                      ) : null}
                    </div>
                  </div>
                </article>
              </div>
            </section>
          )}

          {/* ΟΛΕΣ ΟΙ ΑΝΑΚΟΙΝΩΣΕΙΣ — πλέγμα με σελιδοποίηση */}
          {rest.length > 0 && (
            <section className="section nws-all">
              <div className="container">
                <div className="thematics__head">
                  <span>Όλες οι</span>
                  <span>Ανακοινώσεις</span>
                </div>
                <NewsGrid articles={rest} />
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
