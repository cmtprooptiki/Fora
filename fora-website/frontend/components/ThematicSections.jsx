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

export default function ThematicSections({ forum, intro }) {
  const items = forum?.thematikesEnotites || [];
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

        {intro && <p className="thematics__intro">{intro}</p>}

        <ThematicList
          items={items.map((item, i) => ({
            // 1η: «Εναρκτήρια Ομιλία», τελευταία: «Στρογγυλό Τραπέζι»,
            // ενδιάμεσες: «Ενότητα 1», «Ενότητα 2», ...
            label:
              i === 0
                ? 'Εναρκτήρια Ομιλία'
                : i === items.length - 1
                  ? 'Στρογγυλό Τραπέζι'
                  : `Ενότητα ${i}`,
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
