import { mediaUrl } from '../lib/strapi';

// Εμφανίζει την «Εικόνα Κεφαλίδας» (eikonaHero, π.χ. Group-33-2.png) ως λωρίδα,
// κάτω από τις Θεματικές Ενότητες. Η ίδια εικόνα εμφανίζεται σε κάθε Forum.
export default function HeroImage({ forum }) {
  const img = forum?.eikonaHero?.url ? mediaUrl(forum.eikonaHero.url) : null;
  if (!img) return null;

  return (
    <section className="hero-image-band">
      <img src={img} alt={forum?.thema || 'FORA'} />
    </section>
  );
}
