'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import ThematicItem from './ThematicItem';

// Εφέ αποκάλυψης στις «Θεματικές Ενότητες».
//
// ΣΗΜΑΝΤΙΚΟ: το εφέ οδηγείται από ΕΝΑΝ μετρητή για ΟΛΗ τη λίστα. Έτσι η
// αποκάλυψη είναι αυστηρά διαδοχική: γεμίζουν λέξη-λέξη οι λέξεις της 1ης
// γραμμής, και ΜΟΝΟ όταν ολοκληρωθεί ξεκινά η 2η, μετά η 3η κ.ο.κ.
// (Παλιότερα κάθε γραμμή μέτραγε μόνη της τη θέση της, με αποτέλεσμα δύο ή
// τρεις γραμμές να γεμίζουν ταυτόχρονα.)
export default function ThematicList({ items = [] }) {
  const ref = useRef(null);

  // Λέξεις κάθε γραμμής + πόσες λέξεις προηγούνται συνολικά.
  const { rows, total } = useMemo(() => {
    let running = 0;
    const list = items.map((item) => {
      const words = (item.titlos || '').split(/\s+/).filter(Boolean);
      const row = { ...item, words, offset: running };
      running += words.length;
      return row;
    });
    return { rows: list, total: running };
  }, [items]);

  // Πόσες λέξεις έχουν «ανάψει» συνολικά.
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || total === 0) return undefined;

    // Σεβασμός στη ρύθμιση «λιγότερη κίνηση»: όλα ορατά, χωρίς εφέ.
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (reduce?.matches) {
      setSteps(total);
      return undefined;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      // p = 0 όταν η λίστα μπαίνει από κάτω (κορυφή στο 85% της οθόνης)
      // p = 1 όταν το κάτω άκρο της λίστας φτάνει στο 75% της οθόνης
      const start = vh * 0.85;
      const distance = Math.max(vh * 0.1 + r.height, 1);
      const p = (start - r.top) / distance;
      const clamped = Math.max(0, Math.min(1, p));
      setSteps(Math.round(clamped * total));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [total]);

  return (
    <div className="thematics__list" ref={ref}>
      {rows.map((row, i) => (
        <ThematicItem
          key={i}
          label={row.label}
          words={row.words}
          perigrafi={row.perigrafi}
          // Οι λέξεις αυτής της γραμμής που έχουν ανάψει: ό,τι περισσεύει
          // αφού «γεμίσουν» πρώτα όλες οι προηγούμενες γραμμές.
          active={Math.max(0, Math.min(row.words.length, steps - row.offset))}
        />
      ))}
    </div>
  );
}
