'use strict';

/**
 * ============================================================================
 *  FORA – Ενημέρωση βιογραφικών/ιδιοτήτων ομιλητών (χωρίς νέο κατέβασμα εικόνων)
 * ----------------------------------------------------------------------------
 *  Χρησιμοποιήστε το ΜΟΝΟ αν έχετε ήδη τρέξει το `npm run seed` και θέλετε να
 *  ενημερώσετε τα κείμενα των ομιλητών (π.χ. διορθωμένα βιογραφικά) στις ήδη
 *  υπάρχουσες διοργανώσεις, διατηρώντας τις φωτογραφίες που ανέβηκαν.
 *
 *  Τρέξτε (με το Strapi σταματημένο):  npm run update-bios
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const { content } = require('../data/content.js');

// Αν υπάρχει αποθηκευμένο snapshot από το Strapi (μέσω `npm run export-content`),
// το χρησιμοποιούμε ώστε να ΜΗΝ επαναφέρουμε (revert) τις χειροκίνητες αλλαγές.
let overrides = {};
const localPath = path.join(__dirname, '..', 'data', 'content.local.json');
if (fs.existsSync(localPath)) {
  try {
    overrides = JSON.parse(fs.readFileSync(localPath, 'utf8'));
    console.log('• Βρέθηκαν αποθηκευμένες αλλαγές (data/content.local.json) — θα διατηρηθούν.');
  } catch (e) {
    console.warn('Προσοχή: αδυναμία ανάγνωσης του content.local.json:', e.message);
  }
}

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

  // Επιστρέφει την αποθηκευμένη τιμή αν υπάρχει «ουσιαστικά» (όχι κενή),
  // αλλιώς την τιμή του content.js. Έτσι διατηρούνται οι αλλαγές σας ΚΑΙ
  // εφαρμόζεται νέο περιεχόμενο που προστέθηκε στο content.js (π.χ. πρόγραμμα).
  const has = (v) =>
    v !== null &&
    v !== undefined &&
    !(Array.isArray(v) && v.length === 0) &&
    !(typeof v === 'string' && v.trim() === '');
  const pick = (o, b) => (has(o) ? o : b);

  for (const base of content) {
    const ov = overrides[base.slug] || {};
    const f = {
      ...base,
      thema: pick(ov.thema, base.thema),
      ypotitlos: pick(ov.ypotitlos, base.ypotitlos),
      imerominia: pick(ov.imerominia, base.imerominia),
      imerominiaEnarksis: pick(ov.imerominiaEnarksis, base.imerominiaEnarksis),
      imerominiaLiksis: pick(ov.imerominiaLiksis, base.imerominiaLiksis),
      xoros: pick(ov.xoros, base.xoros),
      paragrafosKefalidas: pick(ov.paragrafosKefalidas, base.paragrafosKefalidas),
      lexeisKleidia: pick(ov.lexeisKleidia, base.lexeisKleidia),
      koumpiKefalidasKeimeno: pick(ov.koumpiKefalidasKeimeno, base.koumpiKefalidasKeimeno),
      koumpiKefalidasSyndesmos: pick(ov.koumpiKefalidasSyndesmos, base.koumpiKefalidasSyndesmos),
      arithmoi: pick(ov.arithmoi, base.arithmoi),
      programma: pick(ov.programma, base.programma),
      omilites: pick(ov.omilites, base.omilites),
    };
    const found = await app.documents('api::forum.forum').findMany({
      filters: { slug: f.slug },
      populate: { omilites: { populate: { fotografia: true } } },
    });
    if (!found || !found.length) {
      console.log(`• ${f.slug}: δεν υπάρχει — παραλείπεται.`);
      continue;
    }
    const doc = found[0];
    const byName = new Map((f.omilites || []).map((s) => [s.onoma, s]));

    const omilites = (doc.omilites || []).map((o) => {
      const src = byName.get(o.onoma);
      return {
        onoma: o.onoma,
        idiotita: src ? src.idiotita : o.idiotita,
        viografiko: src ? src.viografiko : o.viografiko,
        // Διατηρούμε την υπάρχουσα φωτογραφία (δεν ξανακατεβαίνει).
        fotografia: o.fotografia ? o.fotografia.id : null,
      };
    });

    await app.documents('api::forum.forum').update({
      documentId: doc.documentId,
      data: {
        // Κείμενα κεφαλίδας (τίτλος / υπότιτλος / ημερομηνία / χώρος)
        thema: f.thema,
        ypotitlos: f.ypotitlos || null,
        imerominia: f.imerominia || null,
        imerominiaEnarksis: f.imerominiaEnarksis || null,
        imerominiaLiksis: f.imerominiaLiksis || null,
        xoros: f.xoros || null,
        paragrafosKefalidas: f.paragrafosKefalidas || null,
        lexeisKleidia: f.lexeisKleidia || null,
        koumpiKefalidasKeimeno: f.koumpiKefalidasKeimeno || null,
        koumpiKefalidasSyndesmos: f.koumpiKefalidasSyndesmos || null,
        omilites,
        // Αριθμοί/στατιστικά — χωρίς media, τα περνάμε ως έχουν
        ...(f.arithmoi ? { arithmoi: f.arithmoi } : {}),
        // Πρόγραμμα (ατζέντα) — χωρίς media, οπότε το περνάμε ως έχει
        ...(f.programma ? { programma: f.programma } : {}),
      },
      status: 'published',
    });
    console.log(`✓ ${f.slug}: ενημερώθηκαν κείμενα + ${omilites.length} ομιλητές.`);
  }

  console.log('\nΟλοκληρώθηκε. Ξεκινήστε ξανά το Strapi και τον ιστότοπο.');
  await app.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error('ΣΦΑΛΜΑ:', err);
  process.exit(1);
});
