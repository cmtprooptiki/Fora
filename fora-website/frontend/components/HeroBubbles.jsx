'use client';

import { useRef, useEffect } from 'react';

// Πεδίο «μπαλών» στην κεφαλίδα. Με το ποντίκι πάνω στο hero, οι μπάλες
// μετακινούνται απαλά προς την κατεύθυνση του κέρσορα (ομαλή μετάβαση).
export default function HeroBubbles() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const hero = el.closest('.hero') || el.parentElement;
    if (!hero) return undefined;

    // Σεβασμός στην προτίμηση «μειωμένης κίνησης»
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const STRENGTH = 28; // μέγιστη μετατόπιση σε px
    const clamp = (v) => Math.max(-1, Math.min(1, v));
    const onMove = (e) => {
      const r = hero.getBoundingClientRect();
      const nx = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2));
      const ny = clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2));
      // Η ομαλότητα προέρχεται από το CSS transition στο .hero__bubbles-bg
      el.style.transform = `translate3d(${nx * STRENGTH}px, ${ny * STRENGTH}px, 0)`;
    };
    const onLeave = () => {
      el.style.transform = 'translate3d(0, 0, 0)';
    };

    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);
    return () => {
      hero.removeEventListener('mousemove', onMove);
      hero.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <div className="hero__bubbles-bg" ref={ref} aria-hidden="true" />;
}
