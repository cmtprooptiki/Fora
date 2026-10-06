import { getAllForums, getArticles } from '../lib/strapi';
import { SITE_URL } from '../lib/site';

// Παράγει το /sitemap.xml — τον κατάλογο όλων των σελίδων του ιστότοπου.
//
// Διαβάζεται από το Strapi την ώρα του αιτήματος, ώστε κάθε νέα διοργάνωση ή
// άρθρο να μπαίνει αυτόματα, χωρίς rebuild. Αν το Strapi δεν απαντά, οι
// συναρτήσεις επιστρέφουν κενές λίστες και ο χάρτης βγαίνει με τις σταθερές
// σελίδες — δεν «σπάει» ποτέ.
export const dynamic = 'force-dynamic';

// Ο ιστότοπος χρησιμοποιεί trailingSlash: true, οπότε οι κανονικές
// διευθύνσεις τελειώνουν με «/». Ο χάρτης πρέπει να συμφωνεί, αλλιώς οι
// μηχανές βλέπουν δύο εκδοχές της ίδιας σελίδας.
const url = (path = '') => `${SITE_URL}/${path ? `${path}/` : ''}`;

const toDate = (value, fallback) => {
  const d = value ? new Date(value) : null;
  return d && !Number.isNaN(d.getTime()) ? d : fallback;
};

export default async function sitemap() {
  const simera = new Date();

  // Αν για οποιονδήποτε λόγο το Strapi δεν απαντήσει, ο χάρτης βγαίνει με τις
  // σταθερές σελίδες αντί να αποτύχει η σελίδα (ή το build).
  let forums = [];
  let articles = [];
  try {
    [forums, articles] = await Promise.all([getAllForums(), getArticles()]);
  } catch (err) {
    console.warn(`[FORA] sitemap: αδυναμία ανάγνωσης από το Strapi — ${err.message}`);
  }

  // Σταθερές σελίδες
  const stathers = [
    { url: url(), lastModified: simera, changeFrequency: 'weekly', priority: 1 },
    { url: url('news'), lastModified: simera, changeFrequency: 'weekly', priority: 0.8 },
    { url: url('istoriko'), lastModified: simera, changeFrequency: 'monthly', priority: 0.6 },
    { url: url('newsletter'), lastModified: simera, changeFrequency: 'yearly', priority: 0.4 },
  ];

  // Σελίδες προηγούμενων διοργανώσεων (το τρέχον Forum είναι η αρχική)
  const selidesForum = forums
    .filter((f) => f?.slug && !f.trexonForum)
    .map((f) => ({
      url: url(`forum/${f.slug}`),
      lastModified: toDate(f.updatedAt, simera),
      changeFrequency: 'yearly',
      priority: 0.6,
    }));

  // Άρθρα «Νέα & Ανακοινώσεις»
  const selidesArthron = articles
    .filter((a) => a?.slug)
    .map((a) => ({
      url: url(`news/${a.slug}`),
      lastModified: toDate(a.updatedAt || a.imerominia, simera),
      changeFrequency: 'monthly',
      priority: 0.5,
    }));

  return [...stathers, ...selidesForum, ...selidesArthron];
}
