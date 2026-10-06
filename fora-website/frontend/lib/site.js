// Η δημόσια διεύθυνση του ιστότοπου, σε ένα σημείο.
//
// Χρησιμοποιείται από το robots.txt και το sitemap.xml, που πρέπει να
// περιέχουν ΑΠΟΛΥΤΕΣ διευθύνσεις. Αν κάποτε αλλάξει το domain, ορίστε τη
// μεταβλητή NEXT_PUBLIC_SITE_URL στο Portainer — χωρίς αλλαγή κώδικα.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://healthcare-management.gr'
).replace(/\/+$/, '');
