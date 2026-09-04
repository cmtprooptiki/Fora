import { mediaUrl } from '../lib/strapi';

// Λωρίδα χορηγίας κάτω από τις Θεματικές Ενότητες.
//
// • Σε κινητά/tablet (≤1024px): στήνεται με τη ΔΙΑΤΑΞΗ ΤΟΥ FIGMA — κάθετα,
//   λογότυπο FORA → διακοσμητικό σύμβολο → «Χρυσός Χορηγός:» → λογότυπο χορηγού,
//   πάνω σε φόντο με το μοτίβο «λέπια» (φτιαγμένο με CSS, όχι εικόνα).
// • Σε υπολογιστή (≥1025px): μένει η υπάρχουσα φαρδιά εικόνα από το Strapi
//   (eikonaHero), γιατί το σχέδιο για μεγάλες οθόνες δεν έχει αλλάξει.
//
// Τα τρία γραφικά (frontend/public/banner/*.png) προήλθαν από την ίδια εικόνα
// που χρησιμοποιούσε ο ιστότοπος, άρα είναι ακριβώς τα ίδια σύμβολα.
export default function HeroImage({ forum }) {
  const img = forum?.eikonaHero?.url ? mediaUrl(forum.eikonaHero.url) : null;

  // Η ετικέτα διαβάζεται από το Strapi (κατηγορία συνεργατών «Χρυσός Χορηγός»),
  // ώστε να αλλάζει χωρίς επέμβαση στον κώδικα.
  const goldGroup = (forum?.synergates || []).find((gr) =>
    (gr?.katigoria || '').toLowerCase().includes('χρυσ')
  );
  const goldLabel = goldGroup?.katigoria || 'Χρυσός Χορηγός';

  if (!img && !goldGroup) return null;

  return (
    <section className="hero-image-band" aria-label={goldLabel}>
      {/* Υπολογιστής: η φαρδιά εικόνα όπως ήταν */}
      {img && <img className="hero-image-band__wide" src={img} alt={forum?.thema || 'FORA'} />}

      {/* Κινητά/tablet: η κάθετη διάταξη του σχεδίου */}
      <div className="spbanner">
        <img className="spbanner__logo" src="/banner/fora-lockup.png" alt="FORA" />
        <img className="spbanner__mark" src="/banner/divider.png" alt="" aria-hidden="true" />
        <div className="spbanner__gold">
          <p className="spbanner__label">{goldLabel}:</p>
          <img className="spbanner__sponsor" src="/banner/gold-sponsor.png" alt={goldLabel} />
        </div>
      </div>
    </section>
  );
}
