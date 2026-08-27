'use strict';

/**
 * Δημιουργεί αυτόματα το αρχείο ".env" με τυχαία μυστικά κλειδιά.
 * Τρέξτε το ΜΙΑ φορά με:  node scripts/setup-env.js
 * Δεν χρειάζεται να γράψετε ή να καταλάβετε κανένα κλειδί.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.join(__dirname, '..');
const envPath = path.join(root, '.env');

if (fs.existsSync(envPath)) {
  console.log('Το αρχείο .env υπάρχει ήδη — δεν αλλάζω τίποτα. (Αν θέλετε νέο, σβήστε το πρώτα.)');
  process.exit(0);
}

const rnd = () => crypto.randomBytes(16).toString('base64');

const env = `# Δημιουργήθηκε αυτόματα από το scripts/setup-env.js
HOST=0.0.0.0
PORT=1337

APP_KEYS=${rnd()},${rnd()}
API_TOKEN_SALT=${rnd()}
ADMIN_JWT_SECRET=${rnd()}
TRANSFER_TOKEN_SALT=${rnd()}
JWT_SECRET=${rnd()}
ENCRYPTION_KEY=${rnd()}

# Βάση δεδομένων: SQLite (απλό αρχείο) για δοκιμή στον υπολογιστή σας.
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Ποιες ιστοσελίδες επιτρέπεται να διαβάζουν το περιεχόμενο.
CORS_ORIGINS=http://localhost:4321
`;

fs.writeFileSync(envPath, env, 'utf8');
console.log('✓ Δημιουργήθηκε το αρχείο .env με ασφαλή τυχαία κλειδιά.');
console.log('  Μπορείτε τώρα να τρέξετε:  npm run develop');
