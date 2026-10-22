'use strict';

/**
 * ============================================================================
 *  FORA – Περιεχόμενο «Αναλυτικού Προγράμματος» για το ΤΡΕΧΟΝ Forum
 * ----------------------------------------------------------------------------
 *  Γράφει τις τέσσερις ενότητες με συντονιστές, θέματα και ομιλητές, όπως
 *  ορίστηκαν στο σχέδιο. Αντικαθιστά ό,τι υπάρχει στο πεδίο «Πρόγραμμα» της
 *  τρέχουσας διοργάνωσης — τίποτε άλλο δεν αγγίζεται.
 *
 *  Τρέξτε μέσα στο container του Strapi:  npm run seed-programma
 * ============================================================================
 */

// Συντομογραφία: πρόσωπο (όνομα + ιδιότητα)
const p = (onoma, idiotita) => ({ onoma, idiotita: idiotita || null });

const PROGRAMMA = [
  {
    titlos: 'Ψηφιακός Μετασχηματισμός και Διοίκηση με Δεδομένα',
    xronikoBlok: '10:30 – 11:40',
    syntonistes: [
      p('Μιχάλης Παπαδάκης', 'Υποδιευθυντής Οργάνωσης & Πληροφορικής, Ωνάσειο Νοσοκομείο'),
    ],
    stoixeia: [
      {
        titlos: 'EHDS: Τι αλλάζει για τα Νοσοκομεία',
        omilites: [
          p(
            'Γεώργιος Δαφούλας',
            'Ειδικός Συνεργάτης Ψηφιακής Υγείας, Υπουργείο Ψηφιακής Διακυβέρνησης και Τεχνητής Νοημοσύνης'
          ),
        ],
      },
      {
        titlos: 'Διαλειτουργικότητα στην Πράξη: από τα standards στην εφαρμογή',
        omilites: [
          p(
            'Νίκος Ιωσήφ',
            'Ιδρυτής και Διευθύνων Σύμβουλος της BRAINS Innovative Consulting Services | Πρόεδρος του Human Health Intelligence Organization'
          ),
        ],
      },
      {
        titlos: 'Ηλεκτρονικός Φάκελος Ασθενούς και Νοσοκομειακή Συνταγογράφηση',
        omilites: [
          p(
            'Νίκος Ιωσήφ',
            'Ιδρυτής και Διευθύνων Σύμβουλος της BRAINS Innovative Consulting Services | Πρόεδρος του Human Health Intelligence Organization'
          ),
        ],
      },
      {
        titlos: 'Real-World Data, Δευτερογενής Χρήση Δεδομένων και AI στο Νοσοκομείο',
        omilites: [
          p(
            'Δρ. Γιώργος Γουρζουλίδης',
            'Managing Partner | Co-Founder, Health Through Evidence | HTA & Real-World Evidence Expert'
          ),
        ],
      },
    ],
  },

  {
    titlos: 'Ποιότητα, Ασφάλεια και Σύγχρονη Νοσοκομειακή Διοίκηση',
    xronikoBlok: '12:10 – 13:20',
    syntonistes: [
      p('Νεκτάριος Παπαβασιλείου', 'Διοικητής 7ης Υγειονομικής Περιφέρειας Κρήτης'),
    ],
    stoixeia: [
      {
        titlos: 'Κουλτούρα Ποιότητας και Διακυβέρνηση Συστήματος Υγείας',
        omilites: [
          p(
            'Δάφνη Καϊτελίδου',
            'Καθηγήτρια Διοίκησης Υπηρεσιών Υγείας, Τομέας Δημόσιας Υγείας, Τμήμα Νοσηλευτικής, Ε.Κ.Π.Α. | Διευθύντρια Εργαστηρίου Οργάνωσης και Αξιολόγησης Υπηρεσιών Υγείας | Πρόεδρος Ο.ΔΙ.Π.Υ.'
          ),
        ],
      },
      {
        titlos:
          'Health-IQ: Από τα Δεδομένα στην Ποιότητα - Προκλήσεις και Προϋποθέσεις για Αξιόπιστους Δείκτες Υγείας',
        omilites: [
          p(
            'Δρ. Χρήστος Τριανταφύλλου',
            'Project Officer (Quality of Care), WHO Athens Quality of Care and Patient Safety Office'
          ),
          p('Άρτεμις Μαρκάτου', 'Manager | Healthcare Strategy | CMT Prooptiki'),
        ],
      },
      {
        titlos: 'Βελτιστοποίηση της Παραπομπής και της Διαδρομής του Ασθενούς',
        omilites: [
          p(
            'Δρ. Ουρανία (Ράνια) Πινακά',
            'Γενική Ιατρός, Διδάκτωρ Πανεπιστημίου Θεσσαλίας | Συντονίστρια ΤΟΜΥ Αμπελοκήπων Λάρισας'
          ),
          p(
            'Όλγα Σίσκου',
            'Επίκουρη Καθηγήτρια Οικονομικών Υγείας, Τουρισμού και Μετανάστευσης, Πανεπιστήμιο Πειραιώς | Αναπληρώτρια Εθνική Εκπρόσωπος στην Επιτροπή Υγείας του ΟΟΣΑ'
          ),
        ],
      },
      {
        titlos: 'DRGs ως Εργαλείο Διοίκησης, Μέτρησης και Αποδοτικότητας',
        omilites: [
          p('Δρ. Παντελής Μεσσαρόπουλος', 'Πρόεδρος Διοικητικού Συμβουλίου ΚΕ.ΤΕ.Κ.Ν.Υ.'),
        ],
      },
    ],
  },

  {
    titlos: 'Μετασχηματισμός στην Πράξη: Από τον Σχεδιασμό στη Βιώσιμη Εφαρμογή',
    xronikoBlok: '14:00 – 15:10',
    syntonistes: [
      p(
        'Νίκος Πολύζος',
        'Καθηγητής Διοίκησης και Οργάνωσης Υπηρεσιών Υγείας, Τμήμα Ιατρικής ΔΠΘ | Πρόεδρος Τμήματος Νοσηλευτικής ΔΠΘ'
      ),
    ],
    stoixeia: [
      {
        titlos: 'Hospital Transformation in Romania: Reforms, Investments and Lessons Learned',
        omilites: [
          p(
            'Dr. Grațiela-Denisa Iordache',
            'Συντονίστρια, Μονάδα Υλοποίησης Έργων, Εθνική Αρχή για τη Διαχείριση της Ποιότητας στην Υγεία, Ρουμανία'
          ),
          p(
            'Γιώργος Αγγελόπουλος',
            'Consultant, WHO Athens Quality of Care and Patient Safety Office'
          ),
        ],
      },
      {
        titlos: 'Κεντρική εισήγηση: Από τα Νέα Μοντέλα Φροντίδας στην Πραγματική Εφαρμογή',
        typos: 'Κεντρική Ομιλία',
        omilites: [
          p(
            'Δρ. Ελευθέριος Θηραίος',
            'Γενικός/Οικογενειακός Ιατρός, Δ/ντής ΕΣΥ | Προϊστάμενος Γενικής Διεύθυνσης | Οργανισμός Διασφάλισης της Ποιότητας στην Υγεία (Ο.ΔΙ.Π.Υ. Α.Ε.) | Πρόεδρος Ιατρικής Εταιρείας Αθηνών'
          ),
        ],
      },
      {
        titlos: 'Στρογγυλό Τραπέζι: Νέα Μοντέλα Οργάνωσης και Παροχής Φροντίδας',
        typos: 'Στρογγυλό Τραπέζι',
        omilites: [
          p(
            'Κυριακή Μυστακίδου',
            'Καθηγήτρια Ανακουφιστικής Αγωγής, Ιατρική Σχολή ΕΚΠΑ | Υπεύθυνη Μονάδας Ανακουφιστικής Αγωγής «Τζένη Καρέζη»'
          ),
          p('Όλγα Μπαλαούρα', 'Διοικήτρια της 1ης Υγειονομικής Περιφέρειας'),
          p(
            'Παρασκευή Μιχαλοπούλου',
            'Πρόεδρος του Πανελληνίου Συλλόγου Γυναικών με Καρκίνο Μαστού «Άλμα Ζωής» | Αντιπρόεδρος της ΕΛΛΟΚ'
          ),
          p('Δημήτρης Κουναλάκης', 'Ιατρός Γενικής Ιατρικής'),
        ],
      },
    ],
  },

  {
    // Η τελευταία ενότητα εμφανίζεται ως «Στρογγυλό Τραπέζι: …» στον ιστότοπο
    titlos: 'Το Νοσοκομείο του Αύριο - Προς ένα Βιώσιμο Σύστημα Υγείας',
    xronikoBlok: '15:30 – 16:50',
    syntonistes: [p('Δημήτρης Τάκης', 'Δημοσιογράφος')],
    stoixeia: [
      {
        titlos: 'Συμμετέχοντες',
        typos: 'Στρογγυλό Τραπέζι',
        omilites: [
          p('Άδωνις Γεωργιάδης', 'Υπουργός Υγείας'),
          p(
            'Σπύρος Δρίτσας',
            'Τομεάρχης Υγείας, Ελληνική Αριστερή Συμπαράταξη (ΕΛ.Α.Σ.) | Χειρουργός, ΓΝΑ «Ο Ευαγγελισμός»'
          ),
          p('Ιωάννης Τσίμαρης', 'Βουλευτής Ν. Ιωαννίνων | ΠΑΣΟΚ-ΚΙΝΗΜΑ ΑΛΛΑΓΗΣ'),
          p('Γιώργος Καλαμίτσης', 'Ιδρυτικό Μέλος Ένωσης Ασθενών Ελλάδας'),
        ],
      },
    ],
  },
];

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
    filters: { trexonForum: true },
    status: 'published',
  });

  if (!forums || !forums.length) {
    console.error('ΣΦΑΛΜΑ: δεν βρέθηκε διοργάνωση με ενεργό τον διακόπτη «Τρέχον Forum».');
    await app.destroy();
    process.exit(1);
  }

  const forum = forums[0];

  const programma = PROGRAMMA.map((s) => ({
    titlos: s.titlos,
    xronikoBlok: s.xronikoBlok || null,
    syntonistes: (s.syntonistes || []).map((x) => ({ onoma: x.onoma, idiotita: x.idiotita })),
    stoixeia: (s.stoixeia || []).map((it) => ({
      titlos: it.titlos,
      typos: it.typos || 'Ομιλία',
      ora: it.ora || null,
      omilites: (it.omilites || []).map((x) => ({ onoma: x.onoma, idiotita: x.idiotita })),
    })),
  }));

  await app.documents('api::forum.forum').update({
    documentId: forum.documentId,
    data: { programma },
    status: 'published',
  });

  const plithosThematon = programma.reduce((n, s) => n + s.stoixeia.length, 0);
  const plithosProsopon = programma.reduce(
    (n, s) => n + s.syntonistes.length + s.stoixeia.reduce((m, it) => m + it.omilites.length, 0),
    0
  );

  console.log(
    `✓ Ενημερώθηκε το πρόγραμμα του «${forum.slug}»: ` +
      `${programma.length} ενότητες, ${plithosThematon} θέματα, ${plithosProsopon} πρόσωπα.`
  );

  await app.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error('ΣΦΑΛΜΑ:', err);
  process.exit(1);
});
