'use strict';

/**
 * ============================================================================
 *  FORA – Αποθήκευση (export) των αλλαγών που κάνατε στο Strapi
 * ----------------------------------------------------------------------------
 *  Διαβάζει το ΤΡΕΧΟΝ περιεχόμενο από τη βάση του Strapi και το αποθηκεύει στο
 *  αρχείο data/content.local.json. Έτσι, οι αλλαγές που κάνατε χειροκίνητα στο
 *  Strapi «κλειδώνουν» και ΔΕΝ χάνονται όταν ξανατρέξετε το `npm run update-bios`
 *  (το update-bios διαβάζει αυτό το αρχείο αν υπάρχει).
 *
 *  Ροή εργασίας:
 *    1) Κάνετε αλλαγές στο Strapi (και «Δημοσίευση»).
 *    2) Σταματήστε το Strapi και τρέξτε:  npm run export-content
 *    3) (προαιρετικά) commit το data/content.local.json
 *
 *  Τρέξτε (με το Strapi σταματημένο):  npm run export-content
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

async function loadStrapi() {
  const factory = require('@strapi/strapi');
  if (typeof factory.compileStrapi === 'function' && typeof factory.createStrapi === 'function') {
    const ctx = await factory.compileStrapi();
    return factory.createStrapi(ctx).load();
  }
  if (typeof factory.createStrapi === 'function') return factory.createStrapi().load();
  if (typeof factory === 'function') return factory().load();
  if (factory.default) return factory.default().load();
  throw new Error('Δεν βρέθηκε τρόπος εκκίνησης του Strapi.');
}

async function main() {
  const app = await loadStrapi();
  app.log.level = 'error';

  const forums = await app.documents('api::forum.forum').findMany({
    status: 'published',
    pagination: { pageSize: 100 },
    populate: {
      omilites: true,
      arithmoi: true,
      programma: { populate: { stoixeia: true } },
    },
  });

  const out = {};
  for (const f of forums) {
    out[f.slug] = {
      thema: f.thema ?? null,
      ypotitlos: f.ypotitlos ?? null,
      imerominia: f.imerominia ?? null,
      imerominiaEnarksis: f.imerominiaEnarksis ?? null,
      imerominiaLiksis: f.imerominiaLiksis ?? null,
      xoros: f.xoros ?? null,
      eisagogikoKeimeno: f.eisagogikoKeimeno ?? null,
      paragrafosKefalidas: f.paragrafosKefalidas ?? null,
      lexeisKleidia: f.lexeisKleidia ?? null,
      koumpiKefalidasKeimeno: f.koumpiKefalidasKeimeno ?? null,
      koumpiKefalidasSyndesmos: f.koumpiKefalidasSyndesmos ?? null,
      arithmoi: (f.arithmoi || []).map((a) => ({
        arithmos: a.arithmos,
        perigrafi: a.perigrafi,
      })),
      programma: (f.programma || []).map((s) => ({
        titlos: s.titlos,
        xronikoBlok: s.xronikoBlok,
        syntonistis: s.syntonistis,
        stoixeia: (s.stoixeia || []).map((it) => ({
          titlos: it.titlos,
          typos: it.typos,
          ora: it.ora,
          omilitis: it.omilitis,
          idiotita: it.idiotita,
        })),
      })),
      // Μόνο τα κείμενα των ομιλητών (οι φωτογραφίες μένουν στο Strapi ως έχουν).
      omilites: (f.omilites || []).map((o) => ({
        onoma: o.onoma,
        idiotita: o.idiotita,
        viografiko: o.viografiko,
      })),
    };
  }

  const outPath = path.join(__dirname, '..', 'data', 'content.local.json');
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.log(
    `✓ Αποθηκεύτηκαν ${Object.keys(out).length} διοργανώσεις στο data/content.local.json\n` +
      '  Οι αλλαγές σας είναι πλέον ασφαλείς — το update-bios θα τις διατηρεί.'
  );

  await app.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error('ΣΦΑΛΜΑ:', err);
  process.exit(1);
});
