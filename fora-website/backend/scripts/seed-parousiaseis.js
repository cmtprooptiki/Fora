'use strict';

/**
 * ============================================================================
 *  FORA – Παρουσιάσεις ομιλητών του ΤΡΕΧΟΝΤΟΣ Forum
 * ----------------------------------------------------------------------------
 *  Ανεβάζει τα PDF (και όπου υπάρχει, την εικόνα εξωφύλλου) από τον φάκελο
 *  data/parousiaseis στη Βιβλιοθήκη Πολυμέσων και τα γράφει στο πεδίο
 *  «parousiaseis» της τρέχουσας διοργάνωσης. Αντικαθιστά ό,τι υπάρχει σε
 *  αυτό το πεδίο — τίποτε άλλο δεν αγγίζεται.
 *
 *  Μπορεί να ξανατρέξει άφοβα: αρχεία που έχουν ήδη ανέβει (ίδιο όνομα) ΔΕΝ
 *  ξανανεβαίνουν. Αν λείπει κάποιο PDF, η παρουσίαση παραλείπεται με μήνυμα.
 *
 *  Τρέξτε μέσα στο container του Strapi:  npm run seed-parousiaseis
 * ============================================================================
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const DIR = path.join(__dirname, '..', 'data', 'parousiaseis');

// Κατηγορία ανά ενότητα του προγράμματος
const A = 'Ψηφιακός μετασχηματισμός';
const B = 'Ποιότητα & ασφάλεια';
const G = 'Μετασχηματισμός στην πράξη';

// Με τη σειρά του προγράμματος. «exofyllo»: εικόνα από την 1η διαφάνεια —
// μόνο όπου κόβεται καθαρά· στις υπόλοιπες το χρωματιστό πάνελ πιάνει όλο
// το εξώφυλλο.
const PAROUSIASEIS = [
  {
    arxeio: 'FORA2026_A1_Dafoulas_EHDS.pdf',
    exofyllo: 'covers/a1.jpg',
    titlos: 'EHDS: Τι αλλάζει για τα Νοσοκομεία',
    omilitis: 'Γεώργιος Δαφούλας',
    katigoria: A,
    ypotitlos: 'Ο Ευρωπαϊκός Χώρος Δεδομένων Υγείας',
    diafaneies: 19,
    glossa: 'Ελληνικά',
  },
  {
    arxeio: 'FORA2026_A2-A3_Iosif_Psifiakos_Metasximatismos.pdf',
    exofyllo: 'covers/a23.jpg',
    titlos: 'Ψηφιακός Μετασχηματισμός και Διοίκηση με Δεδομένα',
    omilitis: 'Νίκος Ιωσήφ',
    katigoria: A,
    ypotitlos: 'Διαλειτουργικότητα και Ηλεκτρονικός Φάκελος Ασθενούς',
    diafaneies: 10,
    glossa: 'Ελληνικά',
  },
  {
    arxeio: 'FORA2026_A4_Gourzoulidis_Real-World-Data.pdf',
    exofyllo: 'covers/a4.jpg',
    titlos: 'Real-World Data, Secondary Use and AI in the Hospital',
    omilitis: 'Δρ. Γιώργος Γουρζουλίδης',
    katigoria: A,
    ypotitlos: 'From connected systems to decisions that improve care',
    diafaneies: 16,
    glossa: 'Αγγλικά',
  },
  {
    arxeio: 'FORA2026_B1_Kaitelidou_Koultoura_Poiotitas.pdf',
    titlos: 'Κουλτούρα Ποιότητας, Ηγεσία και Διακυβέρνηση Συστήματος Υγείας',
    omilitis: 'Δάφνη Καϊτελίδου',
    katigoria: B,
    diafaneies: 16,
    glossa: 'Ελληνικά',
  },
  {
    arxeio: 'FORA2026_B3_Markatou_Health-IQ.pdf',
    exofyllo: 'covers/b3.jpg',
    titlos: 'Health-IQ: Από τα δεδομένα στην ποιότητα',
    omilitis: 'Άρτεμις Μαρκάτου',
    katigoria: B,
    ypotitlos: 'Προκλήσεις και προϋποθέσεις για αξιόπιστους δείκτες υγείας',
    diafaneies: 10,
    glossa: 'Ελληνικά',
  },
  {
    // Το αρχικό αρχείο είχε πολύ μεγάλο όνομα και δεν διαβαζόταν — όταν
    // μπει εδώ με αυτό το όνομα, η παρουσίαση συμπεριλαμβάνεται αυτόματα.
    arxeio: 'FORA2026_B4_Siskou_Parapompi.pdf',
    titlos: 'Βελτιστοποίηση της παραπομπής και της διαδρομής του ασθενούς',
    omilitis: 'Όλγα Σίσκου',
    katigoria: B,
    ypotitlos: 'Οικονομικές και οργανωτικές επιπτώσεις των δυσλειτουργιών στο σύστημα υγείας',
    glossa: 'Ελληνικά',
  },
  {
    arxeio: 'FORA2026_B5_Pinaka_Parapompi.pdf',
    exofyllo: 'covers/b5.jpg',
    titlos: 'Βελτιστοποίηση της παραπομπής και της διαδρομής του ασθενούς',
    omilitis: 'Δρ. Ουρανία (Ράνια) Πινακά',
    katigoria: B,
    diafaneies: 19,
    glossa: 'Ελληνικά',
  },
  {
    arxeio: 'FORA2026_B6_Messaropoulos_DRG.pdf',
    exofyllo: 'covers/b6.jpg',
    titlos: 'DRG: Αξία στη φροντίδα',
    omilitis: 'Δρ. Παντελής Μεσσαρόπουλος',
    katigoria: B,
    ypotitlos: 'Ο μετασχηματισμός του συστήματος χρηματοδότησης',
    diafaneies: 27,
    glossa: 'Ελληνικά',
  },
  {
    arxeio: 'FORA2026_G1_Aggelopoulos_Quality-of-Care.pdf',
    exofyllo: 'covers/g1.jpg',
    titlos: 'Quality of Care: Οι 25 δείκτες ποιότητας στα νοσοκομεία της Ρουμανίας',
    omilitis: 'Γιώργος Αγγελόπουλος',
    katigoria: G,
    ypotitlos: 'Ανάπτυξη, πιλοτική εφαρμογή και διδάγματα για τη διοίκηση',
    diafaneies: 14,
    glossa: 'Ελληνικά',
  },
  {
    arxeio: 'FORA2026_G2_Iordache_Patient-Safety-Culture.pdf',
    titlos: 'Building a Sound Quality-of-Care and Patient Safety Culture',
    omilitis: 'Dr. Grațiela-Denisa Iordache',
    katigoria: G,
    ypotitlos: 'National Authority for Quality Management in Healthcare, Romania',
    diafaneies: 15,
    glossa: 'Αγγλικά',
  },
  {
    arxeio: 'FORA2026_G3_Thiraios_Nea_Montela_Frontidas.pdf',
    titlos: 'Από τα Νέα Μοντέλα Φροντίδας στην Πραγματική Εφαρμογή',
    omilitis: 'Δρ. Ελευθέριος Θηραίος',
    katigoria: G,
    ypotitlos: 'Κεντρική εισήγηση',
    diafaneies: 51,
    glossa: 'Ελληνικά',
  },
];

const MIME = { '.pdf': 'application/pdf', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png' };

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

  // Ανέβασμα με επαναχρησιμοποίηση: αν υπάρχει ήδη αρχείο με το ίδιο όνομα
  // στη Βιβλιοθήκη Πολυμέσων, κρατάμε εκείνο αντί να το ξανανεβάσουμε.
  async function anevasma(relPath) {
    const src = path.join(DIR, relPath);
    if (!fs.existsSync(src)) return null;
    const name = path.basename(relPath);
    const uniqueName = relPath.startsWith('covers/') ? `FORA2026_cover_${name}` : name;

    const yparxon = await app.db
      .query('plugin::upload.file')
      .findOne({ where: { name: uniqueName } });
    if (yparxon) return yparxon.id;

    // Ανεβάζουμε ΑΝΤΙΓΡΑΦΟ από τον προσωρινό φάκελο, ώστε το αρχείο του
    // project να μένει άθικτο ό,τι κι αν κάνει το Strapi με την πηγή.
    const tmp = path.join(os.tmpdir(), `fora-${Date.now()}-${uniqueName}`);
    fs.copyFileSync(src, tmp);
    const mimetype = MIME[path.extname(name).toLowerCase()] || 'application/octet-stream';
    const uploaded = await app
      .plugin('upload')
      .service('upload')
      .upload({
        data: { fileInfo: { name: uniqueName } },
        files: {
          filepath: tmp,
          path: tmp,
          originalFilename: uniqueName,
          name: uniqueName,
          mimetype,
          type: mimetype,
          size: fs.statSync(tmp).size,
        },
      });
    fs.unlink(tmp, () => {});
    return Array.isArray(uploaded) ? uploaded[0].id : uploaded.id;
  }

  const forums = await app.documents('api::forum.forum').findMany({
    filters: { trexonForum: true },
    status: 'published',
  });
  if (!forums || !forums.length) {
    console.error('ΣΦΑΛΜΑ: δεν βρέθηκε διοργάνωση με ενεργό τον διακόπτη «Τρέχον Forum».');
    await app.destroy();
    process.exit(1);
  }
  const forum = forums[0];

  const parousiaseis = [];
  for (const p of PAROUSIASEIS) {
    const pdfId = await anevasma(p.arxeio);
    if (!pdfId) {
      console.warn(`   ! Λείπει το αρχείο «${p.arxeio}» — παραλείπεται: ${p.omilitis}`);
      continue;
    }
    const coverId = p.exofyllo ? await anevasma(p.exofyllo) : null;
    parousiaseis.push({
      titlos: p.titlos,
      omilitis: p.omilitis || null,
      katigoria: p.katigoria || null,
      ypotitlos: p.ypotitlos || null,
      arxeio: pdfId,
      eikonaExofyllou: coverId,
      diafaneies: p.diafaneies || null,
      glossa: p.glossa || 'Ελληνικά',
    });
    console.log(`   ✓ ${p.omilitis} — ${p.titlos}`);
  }

  // Εναλλαγή ανοιχτού/σκούρου σε «σκακιέρα» στο πλέγμα των 2 στηλών, όπως
  // στο σχέδιο. Υπολογίζεται ΜΕΤΑ τις παραλείψεις, ώστε να μη χαλάει.
  parousiaseis.forEach((p, i) => {
    const seira = Math.floor(i / 2);
    const stili = i % 2;
    p.xroma = (seira + stili) % 2 === 1 ? 'Σκούρο' : 'Ανοιχτό';
  });

  await app.documents('api::forum.forum').update({
    documentId: forum.documentId,
    data: { parousiaseis },
    status: 'published',
  });

  console.log(`\n✓ Το «${forum.slug}» έχει πλέον ${parousiaseis.length} παρουσιάσεις.`);
  await app.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error('ΣΦΑΛΜΑ:', err);
  process.exit(1);
});
