'use client';

import { useEffect, useRef, useState } from 'react';

// Κινούμενη «καταμέτρηση» για τους αριθμούς της κεφαλίδας (π.χ. 400+ , 35+ , 5).
// Ξεκινά όταν το στοιχείο εμφανιστεί στην οθόνη και σέβεται το prefers-reduced-motion.
export default function StatNumber({ value = '', className = '', duration = 3800 }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(value);

  // Ανάλυση: πρόθεμα (π.χ. κενό), αριθμός, κατάληξη (π.χ. «+»)
  const match = String(value).match(/^(\D*)(\d+)(.*)$/);
  const prefix = match ? match[1] : '';
  const target = match ? parseInt(match[2], 10) : null;
  const suffix = match ? match[3] : '';

  useEffect(() => {
    // Αν δεν υπάρχει αριθμός, δείξε το κείμενο ως έχει.
    if (target === null) {
      setDisplay(value);
      return undefined;
    }
    const el = ref.current;
    if (!el) return undefined;

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setDisplay(`${prefix}${target}${suffix}`);
      return undefined;
    }

    setDisplay(`${prefix}0${suffix}`);
    let started = false;
    let rafId = 0;

    const run = () => {
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        const current = Math.round(eased * target);
        setDisplay(`${prefix}${current}${suffix}`);
        if (t < 1) rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true;
            run();
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span className={className} ref={ref}>
      {display}
    </span>
  );
}
