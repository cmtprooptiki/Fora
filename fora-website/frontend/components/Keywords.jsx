// Ενότητα «Λέξεις-κλειδιά»: τρεις κυλιόμενες γραμμές με τα βασικά θέματα του
// Forum (1η: δεξιά→αριστερά, 2η: αριστερά→δεξιά, 3η: δεξιά→αριστερά) και ένα
// κουμπί «Μάθετε περισσότερα για τα Fora». Μόνο για το τρέχον Forum.

const DEFAULT_KEYWORDS =
  'Διοίκηση · Ψηφιακός Μετασχηματισμός · Υποδομές · Βιοϊατρική Τεχνολογία · Αποδοτικότητα · Ασφάλεια Ασθενών · Ποιότητα Υπηρεσιών · Ογκολογική Φροντίδα · Πολιτικές Υγείας · Συνεργασίες · Καινοτομία · DRGs · Οργάνωση Νοσοκομείων';

// Περιστροφή του πίνακα ώστε κάθε γραμμή να ξεκινά από διαφορετική λέξη.
function rotate(arr, n) {
  const k = ((n % arr.length) + arr.length) % arr.length;
  return arr.slice(k).concat(arr.slice(0, k));
}

export default function Keywords({ forum }) {
  const raw = (forum?.lexeisKleidia || DEFAULT_KEYWORDS).trim();
  if (!raw) return null;

  const words = raw
    .split('·')
    .map((w) => w.trim())
    .filter(Boolean);

  // Τρεις γραμμές με διαφορετική αφετηρία και κατεύθυνση.
  const lines = [
    { text: rotate(words, 0).join('  ·  ') + '  ·  ', dir: 'left' },
    { text: rotate(words, 5).join('  ·  ') + '  ·  ', dir: 'right' },
    { text: rotate(words, 9).join('  ·  ') + '  ·  ', dir: 'left' },
  ];

  return (
    <section className="keywords" aria-label="Λέξεις-κλειδιά">
      <div className="keywords__rows" aria-hidden="true">
        {lines.map((ln, i) => (
          <div className="keywords__row" key={i}>
            <div className={`keywords__track keywords__track--${ln.dir}`}>
              <span>{ln.text}</span>
              <span>{ln.text}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="container keywords__cta">
        <a href="/istoriko/" className="btn btn--white keywords__btn">
          Μάθετε περισσότερα για τα Fora
        </a>
      </div>
    </section>
  );
}
