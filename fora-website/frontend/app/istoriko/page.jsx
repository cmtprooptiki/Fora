import { mediaUrl, getAllForums } from '../../lib/strapi';

export const metadata = {
  title: 'Προηγούμενα Fora | FORA',
  description: 'Το αρχείο των προηγούμενων διοργανώσεων του FORA.',
};

export default async function IstorikoPage() {
  const forums = await getAllForums();

  return (
    <>
      <section className="archive-list-hero">
        <div className="container">
          <h1>Προηγούμενα Fora</h1>
          <p>Το αρχείο των διοργανώσεων του FORA – Innovating Healthcare Management.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid editions">
            {forums.map((f) => {
              const cover = f.eikonaHero?.url
                ? mediaUrl(f.eikonaHero.url)
                : f.fotografies?.[0]?.url
                  ? mediaUrl(f.fotografies[0].url)
                  : null;
              // Το τρέχον Forum οδηγεί στην αρχική· τα υπόλοιπα στη σελίδα τους.
              const href = f.trexonForum ? '/' : `/forum/${f.slug}/`;
              return (
                <a className="edition" href={href} key={f.id}>
                  <div className="edition__cover">
                    {cover ? (
                      <img src={cover} alt={f.thema} loading="lazy" />
                    ) : (
                      <span className="edition__year-big">{f.etos}</span>
                    )}
                    {f.trexonForum && <span className="edition__flag">Τρέχον</span>}
                  </div>
                  <div className="edition__body">
                    <span className="edition__badge">
                      {f.arithmos}ο Forum · {f.etos}
                    </span>
                    <h3>{f.thema}</h3>
                    {f.imerominia && <p className="edition__meta">{f.imerominia}</p>}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
