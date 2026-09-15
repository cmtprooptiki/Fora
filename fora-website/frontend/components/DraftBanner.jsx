'use client';

import { usePathname } from 'next/navigation';

// Λωρίδα ανακοίνωσης πάνω από τη μπάρα πλοήγησης (Figma «Draft-Banner»).
//
// Εμφανίζεται ΜΟΝΟ:
//  • όταν το πεδίο «Μήνυμα Κορυφής» (mynimaKorifis) του ΤΡΕΧΟΝΤΟΣ Forum έχει
//    κείμενο — αδειάζοντας το πεδίο στο Strapi, η λωρίδα εξαφανίζεται, και
//  • στην αρχική σελίδα, που είναι η σελίδα του τρέχοντος Forum. Στις σελίδες
//    των προηγούμενων Fora (/forum/...) δεν έχει νόημα.
export default function DraftBanner({ text }) {
  const pathname = usePathname() || '/';
  if (!text) return null;
  if (pathname !== '/') return null;

  return (
    <div className="draft-banner" role="status">
      <span className="draft-banner__icon" aria-hidden="true">!</span>
      <p className="draft-banner__text">{text}</p>
    </div>
  );
}
