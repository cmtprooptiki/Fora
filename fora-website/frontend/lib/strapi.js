import qs from 'qs';

// ΔΗΜΟΣΙΑ διεύθυνση του Strapi — μπαίνει στους συνδέσμους των εικόνων/αρχείων
// που «βλέπει» ο επισκέπτης στον browser. Πρέπει να είναι προσβάσιμη από έξω
// (π.χ. http://SERVER_IP:1337 ή https://admin.example.gr).
export const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

// ΕΣΩΤΕΡΙΚΗ διεύθυνση για τις κλήσεις από τον διακομιστή (server-side fetch).
// Μέσα στο Docker τα containers μιλούν μεταξύ τους με το όνομα της υπηρεσίας
// (http://backend:1337), που είναι πιο γρήγορο και δεν εξαρτάται από το δίκτυο.
// Αν δεν οριστεί, χρησιμοποιείται η δημόσια διεύθυνση.
const STRAPI_INTERNAL_URL = process.env.STRAPI_INTERNAL_URL || STRAPI_URL;

/**
 * Μετατρέπει μια σχετική διεύθυνση αρχείου του Strapi (π.χ. /uploads/x.jpg)
 * σε πλήρη διεύθυνση. Αν είναι ήδη πλήρης (http...), την επιστρέφει ως έχει.
 */
export function mediaUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${STRAPI_URL}${url}`;
}

/** Εσωτερική βοηθητική συνάρτηση που καλεί το REST API του Strapi. */
async function fetchAPI(path, params = {}) {
  const query = qs.stringify(params, { encodeValuesOnly: true });
  const url = `${STRAPI_INTERNAL_URL}/api/${path}${query ? `?${query}` : ''}`;
  let res;
  try {
    // Πάντα φρέσκα δεδομένα (προεπιλογή): ό,τι αλλάζετε στο Strapi φαίνεται
    // αμέσως με ένα refresh, χωρίς νέα έκδοση της εικόνας Docker.
    //
    // ΣΗΜΑΝΤΙΚΟ: με "no-store" οι σελίδες φτιάχνονται την ώρα της επίσκεψης.
    // Έτσι αποφεύγουμε να «παγώσει» άδειο περιεχόμενο κατά το build μέσα στο
    // Docker (όπου το Strapi δεν είναι ακόμη προσβάσιμο).
    //
    // Αν κάποτε θέλετε προσωρινή αποθήκευση για ταχύτητα, ορίστε
    // CONTENT_REVALIDATE_SECONDS=60 (δευτερόλεπτα).
    const revalidate = Number(process.env.CONTENT_REVALIDATE_SECONDS || 0);
    const options =
      revalidate > 0 ? { next: { revalidate } } : { cache: 'no-store' };
    res = await fetch(url, options);
  } catch (err) {
    throw new Error(
      `Δεν ήταν δυνατή η σύνδεση με το Strapi στη διεύθυνση ${STRAPI_INTERNAL_URL}. ` +
        `Βεβαιωθείτε ότι το Strapi τρέχει. (${err.message})`
    );
  }
  if (!res.ok) {
    throw new Error(`Σφάλμα Strapi ${res.status} στη διεύθυνση: ${url}`);
  }
  return res.json();
}

// Τι "συνοδευτικά" δεδομένα να φέρνουμε μαζί με κάθε Forum.
const FORUM_POPULATE = {
  eikonaHero: true,
  eikonaKarouzel: true,
  atzentaPdf: true,
  koumpiKefalidasPdf: true,
  arithmoi: true,
  thematikesEnotites: true,
  omilites: { populate: { fotografia: true } },
  synergates: { populate: { logotypa: { populate: { logotypo: true } } } },
  fotografies: true,
  vinteo: true,
  programma: { populate: { stoixeia: true } },
};

/** Επιστρέφει όλες τις διοργανώσεις (Forums), από τη νεότερη στην παλαιότερη. */
export async function getAllForums() {
  try {
    const json = await fetchAPI('forums', {
      populate: FORUM_POPULATE,
      sort: ['etos:desc'],
      pagination: { pageSize: 100 },
    });
    return json.data || [];
  } catch (err) {
    console.warn(
      '\n[FORA] ΠΡΟΣΟΧΗ: δεν ήταν δυνατή η ανάγνωση περιεχομένου από το Strapi.\n' +
        '        Βεβαιωθείτε ότι το Strapi τρέχει πριν φτιάξετε τον ιστότοπο.\n' +
        `        Λεπτομέρειες: ${err.message}\n`
    );
    return [];
  }
}

/** Επιστρέφει το τρέχον Forum (αυτό με τον διακόπτη "Τρέχον Forum" ενεργό). */
export async function getCurrentForum() {
  const forums = await getAllForums();
  if (forums.length === 0) return null;
  return forums.find((f) => f.trexonForum) || forums[0];
}

/** Επιστρέφει ένα Forum με βάση το slug του (για τις σελίδες αρχείου). */
export async function getForumBySlug(slug) {
  const forums = await getAllForums();
  return forums.find((f) => f.slug === slug) || null;
}

/** Επιστρέφει τις γενικές ρυθμίσεις του ιστότοπου (λογότυπο, επικοινωνία κ.λπ.). */
export async function getSiteSettings() {
  try {
    const json = await fetchAPI('site-setting', { populate: { logotypo: true } });
    return json.data || null;
  } catch (err) {
    return null;
  }
}

/** Μετατρέπει οποιονδήποτε σύνδεσμο YouTube σε κωδικό βίντεο (video id). */
export function youtubeId(input) {
  if (!input) return '';
  const s = String(input).trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = s.match(re);
    if (m) return m[1];
  }
  return '';
}
