import ThematicList from './ThematicList';
import { mediaUrl } from '../lib/strapi';

// Δημιουργεί σύνδεσμο «Προσθήκη στο Ημερολόγιο» (Outlook) για την εκδήλωση.
function outlookUrl(forum) {
  const startRaw = forum?.imerominiaEnarksis;
  if (!startRaw) return null;
  const start = new Date(startRaw);
  if (Number.isNaN(start.getTime())) return null;
  const end = forum?.imerominiaLiksis
    ? new Date(forum.imerominiaLiksis)
    : new Date(start.getTime() + 60 * 60 * 1000);

  const ordinal = forum?.arithmos ? `${forum.arithmos}ο ` : '';
  const subject = `${ordinal}Υβριδικό Forum${forum?.thema ? ` – ${forum.thema}` : ''}`;

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    location: forum?.xoros || '',
    body: forum?.ypotitlos || '',
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

// Μετατρέπει τα τακτικά αριθμητικά «5ο», «3ο» κ.λπ. ώστε το «ο» να μπαίνει
// ΕΚΘΕΤΗΣ — πάνω-δεξιά από τον αριθμό (5ᵒ). Το κείμενο έρχεται από το Strapi
// ως απλό κείμενο, οπότε η αντικατάσταση γίνεται εδώ, κατά την απόδοση.
//
// Το «ο» μπορεί να είναι είτε ελληνικό όμικρον (ο) είτε λατινικό «o» — και τα
// δύο καλύπτονται. Ο έλεγχος «να μη follow-άρει γράμμα ή ψηφίο» αποτρέπει
// λανθασμένα ταιριάσματα μέσα σε λέξεις (π.χ. «100ος» δεν σπάει στη μέση).
function withOrdinals(text) {
  if (!text) return text;
  const re = /(\d+)([οo])(?![\p{L}\p{N}])/gu;
  const out = [];
  let last = 0;
  let m;
  let k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(
      <span key={`ord-${k++}`}>
        {m[1]}
        <sup className="ordinal">{m[2]}</sup>
      </span>
    );
    last = m.index + m[0].length;
  }
  if (out.length === 0) return text;
  if (last < text.length) out.push(text.slice(last));
  return out;
}

// Ετικέτα κάθε θεματικής ενότητας.
//
// ΤΡΕΧΟΝ Forum: όλες αριθμημένες («Ενότητα 1, 2, 3…»), με την τελευταία
// «Στρογγυλό Τραπέζι».
// ΠΡΟΗΓΟΥΜΕΝΑ Fora: μένουν όπως ήταν — 1η «Εναρκτήρια Ομιλία», τελευταία
// «Στρογγυλό Τραπέζι», ενδιάμεσες «Ενότητα 1, 2…».
function labelFor(i, total, isCurrent) {
  if (isCurrent) {
    if (total > 1 && i === total - 1) return 'Στρογγυλό Τραπέζι';
    return `Ενότητα ${i + 1}`;
  }
  if (i === 0) return 'Εναρκτήρια Ομιλία';
  if (i === total - 1) return 'Στρογγυλό Τραπέζι';
  return `Ενότητα ${i}`;
}

export default function ThematicSections({ forum, intro }) {
  const items = forum?.thematikesEnotites || [];
  const isCurrent = !!forum?.trexonForum;
  if (items.length === 0) return null;

  const pdf = forum?.atzentaPdf?.url ? mediaUrl(forum.atzentaPdf.url) : null;
  const calUrl = outlookUrl(forum);

  return (
    <section className="section section--grey" id="thematikes">
      <div className="container">
        <div className="thematics__head">
          <span>Θεματικές</span>
          <span>Ενότητες</span>
        </div>

        {intro && <p className="thematics__intro">{withOrdinals(intro)}</p>}

        <ThematicList
          items={items.map((item, i) => ({
            label: labelFor(i, items.length, isCurrent),
            titlos: item.titlos,
            perigrafi: item.perigrafi,
          }))}
        />

        {(pdf || calUrl) && (
          <div className="thematics__actions">
            {pdf && (
              <a
                href={pdf}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="btn btn--primary"
              >
                Κατεβάστε την Αναλυτική Ατζέντα
              </a>
            )}
            {calUrl && (
              <a
                href={calUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--outline"
              >
                Προσθήκη στο Ημερολόγιο
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
