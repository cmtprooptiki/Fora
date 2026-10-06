// Παράγει το /robots.txt.
//
// Λέει στις μηχανές αναζήτησης ότι ο ιστότοπος είναι ανοιχτός για σάρωση και
// τους δείχνει πού βρίσκεται ο χάρτης σελίδων. Ένα domain χωρίς robots.txt
// μοιάζει «εγκαταλελειμμένο» τόσο στις μηχανές αναζήτησης όσο και στα
// συστήματα κατηγοριοποίησης των εταιρικών firewalls.
import { SITE_URL } from '../lib/site';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Οι διαδρομές του Next.js δεν έχουν νόημα για τις μηχανές
        disallow: ['/_next/', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
