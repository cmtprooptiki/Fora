// ============================================================================
//  Σύστημα εμφάνισης ανά Forum
//  Κάθε διοργάνωση μπορεί να έχει δικό της χρώμα, φόντο και γραμματοσειρά τίτλων.
//  Ο συντάκτης τα επιλέγει στο Strapi (θέμα εμφάνισης + προαιρετικά χρώματα).
// ============================================================================

// --- Έτοιμα θέματα (presets): κύριο χρώμα + χρώμα τόνου ---
const PRESETS = {
  'Κλασικό':   { primary: '#0d4f9f', accent: '#2ea3f2' },
  'Πετρόλ':    { primary: '#0f6e78', accent: '#23b5c4' },
  'Πράσινο':   { primary: '#1f7a44', accent: '#37b06a' },
  'Μωβ':       { primary: '#5b3b91', accent: '#9270c9' },
  'Μπορντό':   { primary: '#8a2437', accent: '#c65168' },
  'Σκούρο':    { primary: '#1f2a37', accent: '#3f9ae0' },
  'Πορτοκαλί': { primary: '#c2560f', accent: '#f2933f' },
};
const DEFAULT_PRESET = 'Κλασικό';

// --- Γραμματοσειρές τίτλων ---
const HEADING_FONTS = {
  Hagrid: '"GreekThetaFix", "hagrid", "Poppins", "Segoe UI", Arial, sans-serif',
  Poppins: '"Poppins", "Segoe UI", Arial, sans-serif',
  Montserrat: '"Montserrat", "Segoe UI", Arial, sans-serif',
  Playfair: '"Playfair Display", Georgia, "Times New Roman", serif',
  Oswald: '"Oswald", "Segoe UI", Arial, sans-serif',
};

// --- Βοηθητικά για χρώματα ---
function parseHex(hex) {
  if (typeof hex !== 'string') return null;
  let h = hex.trim().replace(/^#/, '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}
function toHex({ r, g, b }) {
  const c = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}
// Ανακατεύει με μαύρο (σκουραίνει).
function darken(hex, amount) {
  const rgb = parseHex(hex);
  if (!rgb) return hex;
  return toHex({ r: rgb.r * (1 - amount), g: rgb.g * (1 - amount), b: rgb.b * (1 - amount) });
}
// Ανακατεύει με λευκό (ξανοίγει).
function lighten(hex, amount) {
  const rgb = parseHex(hex);
  if (!rgb) return hex;
  return toHex({
    r: rgb.r + (255 - rgb.r) * amount,
    g: rgb.g + (255 - rgb.g) * amount,
    b: rgb.b + (255 - rgb.b) * amount,
  });
}
function validHex(v) {
  return parseHex(v) ? (v.trim().startsWith('#') ? v.trim() : `#${v.trim()}`) : null;
}

/**
 * Υπολογίζει τις μεταβλητές εμφάνισης (CSS variables) για ένα Forum,
 * με βάση το preset + τυχόν προσωπικές παρακάμψεις χρωμάτων + τη γραμματοσειρά.
 * Επιστρέφει αντικείμενο style έτοιμο για χρήση σε <div style={...}>.
 */
export function forumThemeVars(forum) {
  const preset = PRESETS[forum?.themaEmfanisis] || PRESETS[DEFAULT_PRESET];
  const primary = validHex(forum?.xromaKyrioOverride) || preset.primary;
  const accent = validHex(forum?.xromaAksesouarOverride) || preset.accent;

  const dark = darken(primary, 0.25);
  const tint = lighten(primary, 0.9);
  const footer = darken(primary, 0.55);

  const font = HEADING_FONTS[forum?.grammatoseiraTitlon] || HEADING_FONTS.Hagrid;

  return {
    '--fora-blue': primary,
    '--fora-blue-dark': dark,
    '--fora-accent': accent,
    '--fora-section-tint': tint,
    '--fora-strong': primary,
    '--fora-footer': footer,
    '--fora-hero-from': primary,
    '--fora-hero-to': dark,
    '--font-heading': font,
  };
}
