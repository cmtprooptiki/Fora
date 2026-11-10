import { getArticles, getArticleBySlug, getCurrentForumBasic, mediaUrl } from '../../../lib/strapi';
import { markdownToHtml, splitLead, plainText } from '../../../lib/markdown';

export const dynamic = 'force-dynamic';

/* ============================================================================
   Σελίδα άρθρου — Figma «article-template»
   Κεφαλίδα (διαδρομή, τίτλος, κατηγορία/ημερομηνία/χρόνος ανάγνωσης),
   κείμενο αριστερά + πλαϊνή στήλη δεξιά, «Σχετικά Άρθρα & Νέα» στο τέλος.
   ============================================================================ */

const MINES = [
  'Ιανουαρίου', 'Φεβρουαρίου', 'Μαρτίου', 'Απριλίου', 'Μαΐου', 'Ιουνίου',
  'Ιουλίου', 'Αυγούστου', 'Σεπτεμβρίου', 'Οκτωβρίου', 'Νοεμβρίου', 'Δεκεμβρίου',
];
const IMERES = ['Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο'];
const EXEI_IMERA = /^(Δευτέρα|Τρίτη|Τετάρτη|Πέμπτη|Παρασκευή|Σάββατο|Κυριακή)/i;

// Εφεδρικός σύνδεσμος εγγραφής (ίδιος με της μπάρας πλοήγησης)
const EGGRAFI_EFEDRIA =
  'https://projector-web.gr/cmt-prooptiki/gr/5rd-hybrid-forum-fora-2026/registration';

// Mailchimp — η ίδια λίστα με τη σελίδα /newsletter/
const MAILCHIMP_ACTION =
  'https://cmtprooptiki.us20.list-manage.com/subscribe/post?u=b51df3af774349fd3c01f5069&id=0f59b3d064&v_id=5604&f_id=00245deef0';
const HONEYPOT = 'b_b51df3af774349fd3c01f5069_0f59b3d064';

/** «5 Νοεμβρίου 2025» (με UTC, ώστε να μην αλλάζει η μέρα λόγω ζώνης ώρας) */
function formatDate(iso, meImera = false) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const imerominia = `${d.getUTCDate()} ${MINES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  return meImera ? `${IMERES[d.getUTCDay()]} ${imerominia}` : imerominia;
}

/** Ημερομηνία διοργάνωσης με την ημέρα μπροστά: «Δευτέρα 2 Νοεμβρίου 2026» */
function imerominiaForum(forum) {
  const keimeno = (forum?.imerominia || '').trim();
  if (!keimeno) return formatDate(forum?.imerominiaEnarksis, true);
  if (EXEI_IMERA.test(keimeno) || !forum?.imerominiaEnarksis) return keimeno;
  const d = new Date(forum.imerominiaEnarksis);
  return Number.isNaN(d.getTime()) ? keimeno : `${IMERES[d.getUTCDay()]} ${keimeno}`;
}

/** Ώρα σε ώρα Ελλάδας, π.χ. «10:00» */
function oraElladas(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('el-GR', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Athens',
  });
}

/**
 * Το πεδίο «Χώρος» μπορεί να περιέχει και τις ώρες (π.χ. «… Αθήνα 10:00-17:00»).
 * Τις ξεχωρίζουμε ώστε να μπουν σε δική τους γραμμή με το ρολόι.
 */
function xorosKaiOres(forum) {
  let xoros = (forum?.xoros || '').replace(/\s+/g, ' ').trim();
  let ores = '';
  const m = xoros.match(/(\d{1,2}[:.]\d{2})\s*[-–—]\s*(\d{1,2}[:.]\d{2})/);
  if (m) {
    ores = `${m[1]}–${m[2]}`;
    xoros = xoros.replace(m[0], '').replace(/[\s,|·•–—-]+$/, '').trim();
  } else {
    const apo = oraElladas(forum?.imerominiaEnarksis);
    const eos = oraElladas(forum?.imerominiaLiksis);
    if (apo && eos && apo !== eos) ores = `${apo}–${eos}`;
  }
  return { xoros, ores };
}

/** Περίληψη για τις κάρτες: η «Περίληψη» του Strapi ή η αρχή του κειμένου. */
function perilipsiGia(a) {
  if (a?.perilipsi) return a.perilipsi;
  const t = plainText(a?.keimeno);
  if (t.length <= 160) return t;
  return `${t.slice(0, 160).replace(/\s+\S*$/, '')}…`;
}

/** Ετικέτες (hashtags) από το πεδίο «etiketes»: χωρισμένες με κόμμα ή αλλαγή γραμμής. */
function etiketesGia(a) {
  return String(a?.etiketes || '')
    .split(/[,\n;]+/)
    .map((t) => t.trim().replace(/^#+/, '').trim())
    .filter(Boolean)
    .map((t) => `#${t}`);
}

/* ------------------------------ Εικονίδια ------------------------------- */
const svgProps = {
  viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2,
  strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true,
};
const IconCalendar = () => (
  <svg {...svgProps}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const IconPin = () => (
  <svg {...svgProps}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IconClock = () => (
  <svg {...svgProps}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);
const Chevron = () => (
  <svg className="nws-crumbs__sep" width="6" height="10" viewBox="0 0 6 10" fill="none" aria-hidden="true">
    <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* -------------------------------- Σελίδα -------------------------------- */

export async function generateMetadata({ params }) {
  const a = await getArticleBySlug(params.slug);
  if (!a) return {};
  return { title: `${a.titlos} | FORA`, description: a.perilipsi || undefined };
}

export default async function ArticlePage({ params }) {
  const [articles, forum] = await Promise.all([getArticles(), getCurrentForumBasic()]);
  const a = articles.find((x) => x.slug === params.slug) || null;

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
  const analogia = a.eikona?.width && a.eikona?.height ? a.eikona.width / a.eikona.height : 2.4;
  const fardia = analogia >= 1.9;
  const { lead, rest } = splitLead(a.keimeno);
  const lexeis = plainText(a.keimeno).split(' ').filter(Boolean).length;
  const xronos = a.xronosAnagnosis || (lexeis ? Math.max(1, Math.round(lexeis / 200)) : 0);
  const etiketes = etiketesGia(a);

  // Πλαϊνή στήλη: πριν από τη διοργάνωση «Εγγραφή Τώρα»· μετά, οδηγεί στο υλικό.
  const telos = forum?.imerominiaLiksis || forum?.imerominiaEnarksis;
  const ejeiPerasei = telos ? new Date(telos).getTime() < Date.now() : false;
  const registerHref = forum?.syndesmoEggrafis?.trim() || EGGRAFI_EFEDRIA;
  const { xoros, ores } = xorosKaiOres(forum);
  const imerominiaDiexagogis = imerominiaForum(forum);

  // «Σχετικά»: τα 3 άρθρα που είναι πιο κοντά χρονικά σε αυτό
  const xronosArthrou = new Date(a.imerominia).getTime() || 0;
  const sxetika = articles
    .filter((x) => x.id !== a.id)
    .map((x) => ({ x, apostasi: Math.abs((new Date(x.imerominia).getTime() || 0) - xronosArthrou) }))
    .sort((p, q) => p.apostasi - q.apostasi)
    .slice(0, 3)
    .map((p) => p.x)
    .sort((p, q) => (new Date(q.imerominia).getTime() || 0) - (new Date(p.imerominia).getTime() || 0));

  return (
    <>
      {/* ------------------------------ Κεφαλίδα ------------------------------ */}
      <section className="nws-hero nws-hero--article">
        <div className="container nws-hero__inner">
          <nav className="nws-crumbs" aria-label="Διαδρομή">
            <a href="/">Αρχική</a>
            <Chevron />
            <a href="/news/">Νέα &amp; Ανακοινώσεις</a>
            <Chevron />
            <span className="nws-crumbs__current nws-crumbs__current--short" aria-current="page">
              {a.titlos}
            </span>
          </nav>
          <h1 className="nws-hero__title nws-hero__title--article">{a.titlos}</h1>
          <div className="art-meta">
            {a.katigoria && <span className="art-meta__tag">{a.katigoria}</span>}
            {a.imerominia && <span>Δημοσιεύθηκε στις: {formatDate(a.imerominia, true)}</span>}
            {a.imerominia && xronos ? (
              <span className="art-meta__dot" aria-hidden="true">•</span>
            ) : null}
            {xronos ? <span>Χρόνος ανάγνωσης: {xronos} {xronos === 1 ? 'λεπτό' : 'λεπτά'}</span> : null}
          </div>
        </div>
      </section>

      {/* ---------------------- Κείμενο + πλαϊνή στήλη ----------------------- */}
      <section className="art-main">
        <div className="container art-split">
          <article className="art-body">
            {/* Πλαίσιο εικόνας 1304×540 όπως στο σχέδιο. Οι φαρδιές φωτογραφίες το
                γεμίζουν· οι τετράγωνες/κάθετες (π.χ. αφίσες με κείμενο) φαίνονται
                ολόκληρες, με θολό φόντο της ίδιας εικόνας στα πλάγια. */}
            {img && (
              <div className={`art-body__media${fardia ? '' : ' art-body__media--fit'}`}>
                {!fardia && <img className="art-body__media-bg" src={img} alt="" aria-hidden="true" />}
                <img className="art-body__img" src={img} alt={a.titlos} />
              </div>
            )}

            {lead && (
              <>
                <p className="art-body__lead" dangerouslySetInnerHTML={{ __html: lead }} />
                {rest.trim() && <hr className="art-body__rule" />}
              </>
            )}

            {rest.trim() && (
              <div
                className="nws-article__body"
                dangerouslySetInnerHTML={{ __html: markdownToHtml(rest) }}
              />
            )}

            {etiketes.length > 0 && (
              <ul className="art-tags" aria-label="Ετικέτες">
                {etiketes.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
          </article>

          <aside className="art-side" aria-label="Πληροφορίες Forum">
            {/* Συμμετοχή στο Forum (ή, μετά τη διοργάνωση, το υλικό της) */}
            {ejeiPerasei ? (
              <div className="art-card art-card--cta">
                <h2 className="art-card__title">Υλικό του Forum</h2>
                <p className="art-card__text">
                  Δείτε φωτογραφίες, βίντεο και τις παρουσιάσεις των ομιλητών από τη
                  διοργάνωση.
                </p>
                <a className="btn btn--primary art-card__btn" href="/#gallery">
                  Δείτε το υλικό
                </a>
              </div>
            ) : (
              <div className="art-card art-card--cta">
                <h2 className="art-card__title">Συμμετοχή στο Forum</h2>
                <p className="art-card__text">
                  Κλείστε τη θέση σας σήμερα για να παρακολουθήσετε ζωντανά τις εργασίες του
                  συνεδρίου, είτε δια ζώσης είτε διαδικτυακά.
                </p>
                <a
                  className="btn btn--primary art-card__btn"
                  href={registerHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Εγγραφή Τώρα
                </a>
              </div>
            )}

            {/* Πληροφορίες Διεξαγωγής */}
            {(imerominiaDiexagogis || xoros || ores) && (
              <div className="art-card art-card--info">
                <h2 className="art-card__title">Πληροφορίες Διεξαγωγής</h2>
                <ul className="art-info">
                  {imerominiaDiexagogis && (
                    <li>
                      <IconCalendar />
                      <span>{imerominiaDiexagogis}</span>
                    </li>
                  )}
                  {xoros && (
                    <li>
                      <IconPin />
                      <span>{xoros}</span>
                    </li>
                  )}
                  {ores && (
                    <li>
                      <IconClock />
                      <span>{ores}</span>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Newsletter — στέλνει στην ίδια λίστα Mailchimp με τη σελίδα /newsletter/ */}
            <div className="art-card art-card--nl">
              <h2 className="art-card__title">Newsletter</h2>
              <p className="art-card__text">
                Εγγραφείτε για να λαμβάνετε πρώτοι τις ανακοινώσεις των FORA.
              </p>
              <form
                className="art-nl"
                action={MAILCHIMP_ACTION}
                method="post"
                target="_blank"
              >
                <input
                  className="art-nl__input"
                  type="email"
                  name="EMAIL"
                  required
                  placeholder="Το Email σας..."
                  aria-label="Το Email σας"
                />
                <input type="hidden" name="tags" value="4269968" />
                <div aria-hidden="true" className="nlp__hp">
                  <input type="text" name={HONEYPOT} tabIndex={-1} defaultValue="" />
                </div>
                <button type="submit" name="subscribe" className="art-nl__btn">
                  Εγγραφή
                </button>
              </form>
            </div>
          </aside>
        </div>
      </section>

      {/* ------------------------ Σχετικά Άρθρα & Νέα ------------------------ */}
      {sxetika.length > 0 && (
        <section className="art-rel">
          <div className="container">
            <h2 className="art-rel__title">Σχετικά Άρθρα &amp; Νέα</h2>
            <div className="art-rel__grid">
              {sxetika.map((r) => {
                const thumb = r.eikona?.formats?.medium?.url || r.eikona?.url;
                return (
                  <a className="art-rel__card" href={`/news/${r.slug}/`} key={r.id}>
                    {thumb ? (
                      <img className="art-rel__img" src={mediaUrl(thumb)} alt="" loading="lazy" />
                    ) : (
                      <span className="art-rel__img art-rel__img--empty" aria-hidden="true" />
                    )}
                    <span className="art-rel__body">
                      <span className="art-rel__date">{formatDate(r.imerominia)}</span>
                      <span className="art-rel__name">{r.titlos}</span>
                      <span className="art-rel__sum">{perilipsiGia(r)}</span>
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
