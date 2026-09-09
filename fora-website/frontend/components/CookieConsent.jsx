'use client';

import { useCallback, useEffect, useState } from 'react';
import Script from 'next/script';

// Ενημέρωση & συγκατάθεση για cookies.
//
// ΣΗΜΑΝΤΙΚΟ: το Google Analytics ΔΕΝ φορτώνεται καθόλου πριν ο επισκέπτης
// συναινέσει. Γι' αυτό τα <Script> του GA βρίσκονται εδώ μέσα και όχι στο
// layout — αν έμεναν εκεί, θα έτρεχαν σε κάθε επίσκεψη και η μπάρα θα ήταν
// απλώς διακοσμητική.
//
// Αποθηκεύεται στο localStorage (όχι cookie) — δεν χρειάζεται συγκατάθεση
// για κάτι που δεν είναι cookie παρακολούθησης.

const KEY = 'fora-cookie-consent';

export default function CookieConsent({ gaId }) {
  const [ready, setReady] = useState(false); // έχει διαβαστεί η επιλογή;
  const [choice, setChoice] = useState(null); // { analytics: boolean } | null
  const [showPrefs, setShowPrefs] = useState(false);
  const [analyticsPref, setAnalyticsPref] = useState(false);

  useEffect(() => {
    let saved = null;
    try {
      saved = JSON.parse(window.localStorage.getItem(KEY) || 'null');
    } catch {
      saved = null;
    }
    if (saved && typeof saved.analytics === 'boolean') {
      setChoice(saved);
      setAnalyticsPref(saved.analytics);
    }
    setReady(true);
  }, []);

  const save = useCallback((analytics) => {
    const value = { analytics, ts: new Date().toISOString() };
    try {
      window.localStorage.setItem(KEY, JSON.stringify(value));
    } catch {
      /* ιδιωτική περιήγηση */
    }
    setChoice(value);
    setShowPrefs(false);
  }, []);

  // Επιτρέπει να ξανανοίξει η μπάρα από αλλού (π.χ. σύνδεσμο στο υποσέλιδο):
  // onClick={() => window.foraOpenCookieSettings()}
  useEffect(() => {
    window.foraOpenCookieSettings = () => {
      setShowPrefs(true);
      setChoice(null);
    };
    return () => {
      delete window.foraOpenCookieSettings;
    };
  }, []);

  const allowAnalytics = !!(choice && choice.analytics && gaId);

  return (
    <>
      {/* Το GA μπαίνει ΜΟΝΟ μετά από ρητή συγκατάθεση */}
      {allowAnalytics && (
        <>
          <Script
            id="ga4-src"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
          </Script>
        </>
      )}

      {/* Η μπάρα εμφανίζεται μόνο όσο δεν έχει γίνει επιλογή.
          Δεν αποδίδεται πριν διαβαστεί το localStorage, ώστε να μην
          «αναβοσβήνει» σε όποιον έχει ήδη απαντήσει. */}
      {ready && !choice && (
        <div className="cookie" role="dialog" aria-labelledby="cookie-title">
          <div className="cookie__head">
            <span className="cookie__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
                   strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2.6a9.4 9.4 0 1 0 9.4 9.4 3.3 3.3 0 0 1-4.3-4.3A3.3 3.3 0 0 1 12 2.6z" />
                <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
                <circle cx="13.5" cy="14.5" r="1" fill="currentColor" stroke="none" />
                <circle cx="8.5" cy="15.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </span>
            <h2 className="cookie__title" id="cookie-title">
              Σεβόμαστε την ιδιωτικότητά σας
            </h2>
          </div>
          <p className="cookie__text">
            Χρησιμοποιούμε cookies για να βελτιώσουμε την εμπειρία περιήγησης και
            να αναλύσουμε την επισκεψιμότητα του ιστότοπου. Πατώντας «Αποδοχή
            όλων», συναινείτε στη χρήση τους.
          </p>

          {showPrefs && (
            <div className="cookie__prefs">
              <div className="cookie__pref">
                <div>
                  <strong>Απαραίτητα</strong>
                  <span>Χρειάζονται για τη λειτουργία του ιστότοπου.</span>
                </div>
                <span className="cookie__always">Πάντα ενεργά</span>
              </div>
              <label className="cookie__pref">
                <div>
                  <strong>Στατιστικά</strong>
                  <span>Google Analytics — ανώνυμη μέτρηση επισκεψιμότητας.</span>
                </div>
                <input
                  type="checkbox"
                  checked={analyticsPref}
                  onChange={(e) => setAnalyticsPref(e.target.checked)}
                />
              </label>
            </div>
          )}

          <div className="cookie__actions">
            {showPrefs ? (
              <button
                type="button"
                className="cookie__btn cookie__btn--ghost"
                onClick={() => save(analyticsPref)}
              >
                Αποθήκευση επιλογών
              </button>
            ) : (
              <button
                type="button"
                className="cookie__btn cookie__btn--ghost"
                onClick={() => setShowPrefs(true)}
              >
                Προσαρμογή
              </button>
            )}
            <button
              type="button"
              className="cookie__btn cookie__btn--ghost"
              onClick={() => save(false)}
            >
              Απόρριψη όλων
            </button>
            <button
              type="button"
              className="cookie__btn cookie__btn--solid"
              onClick={() => save(true)}
            >
              Αποδοχή όλων
            </button>
          </div>
        </div>
      )}
    </>
  );
}
