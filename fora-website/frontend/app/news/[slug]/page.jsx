import { getArticleBySlug, mediaUrl } from '../../../lib/strapi';

export const dynamic = 'force-dynamic';

const MINES = [
  'Ιανουαρίου', 'Φεβρουαρίου', 'Μαρτίου', 'Απριλίου', 'Μαΐου', 'Ιουνίου',
  'Ιουλίου', 'Αυγούστου', 'Σεπτεμβρίου', 'Οκτωβρίου', 'Νοεμβρίου', 'Δεκεμβρίου',
];
function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getDate()} ${MINES[d.getMonth()]} ${d.getFullYear()}`;
}

export async function generateMetadata({ params }) {
  const a = await getArticleBySlug(params.slug);
  if (!a) return {};
  return { title: `${a.titlos} | FORA`, description: a.perilipsi || undefined };
}

export default async function ArticlePage({ params }) {
  const a = await getArticleBySlug(params.slug);

  if (!a) {
    return (
      <section className="container empty-state">
        <h1>Δεν βρέθηκε</h1>
        <p className="section__intro">
          Το άρθρο που ζητήσατε δεν βρέθηκε. <a href="/news/">Δείτε όλα τα νέα</a>.
        </p>
      </section>
    );
  }

  const img = a.eikona?.url ? mediaUrl(a.eikona.url) : null;

  return (
    <>
      <section className="nws-hero">
        <div className="container nws-hero__inner">
          <nav className="nws-crumbs" aria-label="Διαδρομή">
            <a href="/">Αρχική</a>
            <span aria-hidden="true">›</span>
            <a href="/news/">Νέα &amp; Ανακοινώσεις</a>
            <span aria-hidden="true">›</span>
            <span className="nws-crumbs__current">{a.titlos}</span>
          </nav>
          <h1 className="nws-hero__title nws-hero__title--article">{a.titlos}</h1>
          <p className="nws-hero__sub">
            {formatDate(a.imerominia)}
            {a.xronosAnagnosis ? ` · Χρόνος ανάγνωσης: ${a.xronosAnagnosis} λεπτά` : ''}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container nws-article">
          {img && <img className="nws-article__img" src={img} alt={a.titlos} />}
          {a.keimeno && (
            <div
              className="nws-article__body"
              dangerouslySetInnerHTML={{ __html: a.keimeno.replace(/\n/g, '<br/>') }}
            />
          )}
          <p className="nws-article__back">
            <a href="/news/">← Όλα τα νέα &amp; ανακοινώσεις</a>
          </p>
        </div>
      </section>
    </>
  );
}
