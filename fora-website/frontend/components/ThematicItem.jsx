'use client';

import { useEffect, useRef, useState } from 'react';

// Μία θεματική ενότητα ως γραμμή. Ο τίτλος «γεμίζει» με σκούρο χρώμα, λέξη-λέξη,
// καθώς η γραμμή περνά μέσα από την οθόνη (εφέ αποκάλυψης στο scroll).
export default function ThematicItem({ titlos, perigrafi, label }) {
  const ref = useRef(null);
  const words = (titlos || '').split(/\s+/).filter(Boolean);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const start = vh * 0.9; // ξεκινά να γεμίζει όταν μπει από κάτω
      const end = vh * 0.4; // έχει γεμίσει όταν φτάσει στο πάνω-μέσο
      const p = (start - r.top) / (start - end);
      const clamped = Math.max(0, Math.min(1, p));
      setActive(Math.round(clamped * words.length));
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
  }, [words.length]);

  return (
    <div className="thematic-row" ref={ref}>
      <div className="thematic-row__main">
        <h3 className="thematic-row__title">
          {words.map((w, i) => (
            <span key={i} className={i < active ? 'is-on' : ''}>
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </h3>
        {perigrafi && <p className="thematic-row__desc">{perigrafi}</p>}
      </div>
      <span className="thematic-row__label">{label}</span>
    </div>
  );
}
