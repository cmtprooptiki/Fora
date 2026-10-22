// Αναγνώριση φύλου από ελληνικό ονοματεπώνυμο, ώστε οι ετικέτες να γράφονται
// σωστά: ΟΜΙΛΗΤΗΣ / ΟΜΙΛΗΤΡΙΑ, ΣΥΝΤΟΝΙΣΤΗΣ / ΣΥΝΤΟΝΙΣΤΡΙΑ.
//
// Ο κανόνας: στα ελληνικά τα ανδρικά ονόματα και επώνυμα τελειώνουν σε «ς»
// (Δαφούλας, Πολύζος, Γουρζουλίδης, Γιώργος), ενώ τα γυναικεία σχεδόν ποτέ
// (Καϊτελίδου, Δάφνη). Αρκεί μία λέξη του ονόματος να τελειώνει σε «ς».

export const xorisTonous = (s) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

// Γυναικεία ονόματα αρχαίας κλίσης που λήγουν σε «ς» — οι εξαιρέσεις του
// κανόνα. Ελέγχονται ως ΟΛΟΚΛΗΡΗ λέξη, για να μην μπερδεύονται με επώνυμα.
const GYNAIKEIA_SE_SIGMA = [
  'αρτεμις', 'θετις', 'ιρις', 'ελπις', 'δωρις', 'νεμεσις', 'λαχεσις', 'τηθυς',
];

// Χειροκίνητες εξαιρέσεις για ονόματα που δεν ακολουθούν τον κανόνα — κυρίως
// ξενόγλωσσα. Γράψτε το επώνυμο με πεζά και χωρίς τόνους.
const GYNAIKES = [];
const ANDRES = [];

export function einaiGynaika(onoma) {
  const kathara = xorisTonous(onoma);
  if (GYNAIKES.some((n) => kathara.includes(n))) return true;
  if (ANDRES.some((n) => kathara.includes(n))) return false;
  const lekseis = kathara.replace(/[.,·()]/g, ' ').split(/\s+/).filter(Boolean);
  if (lekseis.some((w) => GYNAIKEIA_SE_SIGMA.includes(w))) return true;
  // «σ» μαζί με «ς»: το toLowerCase() μετατρέπει το τελικό «Σ» των κεφαλαίων σε «σ»
  return !lekseis.some((w) => /[σς]$/.test(w));
}

/** «Ομιλητής» ή «Ομιλήτρια» ανάλογα με το όνομα. */
export const omilitisLabel = (onoma) =>
  einaiGynaika(onoma) ? 'Ομιλήτρια' : 'Ομιλητής';

/** «Συντονιστής» ή «Συντονίστρια» ανάλογα με το όνομα. */
export const syntonistisLabel = (onoma) =>
  einaiGynaika(onoma) ? 'Συντονίστρια' : 'Συντονιστής';

/**
 * Ετικέτα για ομάδα προσώπων: στον ενικό ακολουθεί το φύλο, στον πληθυντικό
 * χρησιμοποιείται ο κοινός τύπος «Ομιλητές» / «Συντονιστές».
 */
export function etiketaOmadas(prosopa, plithyntikos = 'Ομιλητές', enikos = omilitisLabel) {
  const lista = (prosopa || []).filter((p) => p && p.onoma);
  if (lista.length === 0) return '';
  return lista.length === 1 ? enikos(lista[0].onoma) : plithyntikos;
}
