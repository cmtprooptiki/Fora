'use client';

import { useState } from 'react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function Newsletter({ settings }) {
  const text =
    settings?.keimenoNewsletter ||
    'Μην χάσετε καμία ενημέρωση. Γραφτείτε τώρα στο newsletter μας.';
  const [msg, setMsg] = useState({ text: '', type: '' });

  async function onSubmit(e) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get('email');
    setMsg({ text: 'Γίνεται εγγραφή...', type: '' });
    try {
      const res = await fetch(`${STRAPI_URL}/api/newsletter-subscribers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { email } }),
      });
      if (res.ok) {
        setMsg({ text: 'Ευχαριστούμε! Η εγγραφή σας ολοκληρώθηκε.', type: 'ok' });
        e.target.reset();
      } else {
        const j = await res.json().catch(() => ({}));
        const already =
          j?.error?.message?.toLowerCase().includes('unique') || j?.error?.status === 400;
        setMsg({
          text: already
            ? 'Αυτό το email είναι ήδη εγγεγραμμένο.'
            : 'Κάτι πήγε στραβά. Δοκιμάστε ξανά.',
          type: 'err',
        });
      }
    } catch (err) {
      setMsg({ text: 'Δεν ήταν δυνατή η σύνδεση. Δοκιμάστε ξανά.', type: 'err' });
    }
  }

  return (
    <section className="section" id="newsletter">
      <div className="container newsletter__inner">
        <div>
          <span className="section__eyebrow">Newsletter</span>
          <h2>Μείνετε ενημερωμένοι</h2>
          <p className="section__intro">{text}</p>
        </div>
        <form className="newsletter__form" onSubmit={onSubmit}>
          <input type="email" name="email" required placeholder="Η διεύθυνση email σας" aria-label="Email" />
          <button type="submit" className="btn btn--primary">
            Εγγραφή
          </button>
          <p className={`newsletter__msg ${msg.type}`} role="status">
            {msg.text}
          </p>
        </form>
      </div>
    </section>
  );
}
