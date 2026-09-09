import './globals.css';
import Script from 'next/script';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getSiteSettings, getAllForums } from '../lib/strapi';

// Κωδικός Google Analytics (GA4). Δεν είναι μυστικό — φαίνεται ούτως ή άλλως
// στον κώδικα της σελίδας — γι' αυτό μπαίνει κατευθείαν εδώ. Αν χρειαστεί
// άλλος κωδικός (π.χ. δοκιμαστικό περιβάλλον), ορίζεται το NEXT_PUBLIC_GA_ID
// ΚΑΤΑ ΤΟ BUILD (τα NEXT_PUBLIC_* «ψήνονται» στη μεταγλώττιση, δεν διαβάζονται
// την ώρα που τρέχει το container).
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-TM9CH6EX35';

export const metadata = {
  title: 'FORA – Innovating Healthcare Management',
  description:
    'FORA – Innovating Healthcare Management. Το ετήσιο υβριδικό forum της CMT Prooptiki για την καινοτομία στην οργάνωση και διοίκηση των νοσοκομειακών μονάδων.',
};

export const viewport = {
  themeColor: '#0d4f9f',
};

export default async function RootLayout({ children }) {
  const settings = await getSiteSettings();
  const forums = await getAllForums();
  // Στο μενού εμφανίζονται ΟΛΕΣ οι διοργανώσεις, από τη νεότερη προς την
  // παλαιότερη (Forum 2025, 2024, 2023, 2022) — όπως στο σχέδιο.
  const archive = forums
    .slice()
    .sort((a, b) => (b.etos || 0) - (a.etos || 0));
  const typekit =
    process.env.NEXT_PUBLIC_TYPEKIT_URL || 'https://use.typekit.net/njw0ocx.css';

  return (
    <html lang="el">
      <head>
        {/* Γραμματοσειρές: Adobe Fonts (Hagrid, Cambo) + Google Fonts (Lato) */}
        <link rel="stylesheet" href={typekit} />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,400&display=swap"
        />
        {/* Επιλογές γραμματοσειράς τίτλων ανά Forum */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Oswald:wght@500;600;700&family=Playfair+Display:wght@600;700;800&family=Poppins:wght@600;700;800&display=swap"
        />
      </head>
      <body>
        <Header settings={settings} archive={archive} />
        <main>{children}</main>
        <Footer settings={settings} />

        {/* Google Analytics (GA4). Το «afterInteractive» φορτώνει το script
            αφού γίνει διαδραστική η σελίδα, ώστε να μην καθυστερεί η εμφάνιση. */}
        {GA_ID && (
          <>
            <Script
              id="ga4-src"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
