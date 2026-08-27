import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getSiteSettings, getAllForums } from '../lib/strapi';

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
  const current = forums.find((f) => f.trexonForum);
  const archive = (current ? forums.filter((f) => f.id !== current.id) : forums)
    .slice()
    .sort((a, b) => (a.etos || 0) - (b.etos || 0));
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
      </body>
    </html>
  );
}
