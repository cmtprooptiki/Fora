const path = require('path');

module.exports = ({ env }) => {
  const client = env('DATABASE_CLIENT', 'sqlite');

  const connections = {
    // Επιλογή 1: SQLite — ένα απλό αρχείο βάσης, ιδανικό για δοκιμές στον υπολογιστή σας.
    sqlite: {
      connection: {
        // ΣΗΜΑΝΤΙΚΟ (Docker): αν το DATABASE_FILENAME είναι απόλυτη διαδρομή
        // (π.χ. /app/.tmp/data.db) τη χρησιμοποιούμε ΩΣ ΕΧΕΙ, ώστε το αρχείο της
        // βάσης να βρίσκεται πάντα μέσα στον μόνιμο τόμο (volume) και να μη
        // χάνεται σε κάθε νέα έκδοση. Αλλιώς (τοπικά) είναι σχετική διαδρομή.
        filename: (() => {
          const f = env('DATABASE_FILENAME', '.tmp/data.db');
          return path.isAbsolute(f) ? f : path.join(__dirname, '..', f);
        })(),
      },
      useNullAsDefault: true,
    },
    // Επιλογή 2: PostgreSQL — συνιστάται για τον διακομιστή (production).
    postgres: {
      connection: {
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'fora'),
        user: env('DATABASE_USERNAME', 'fora'),
        password: env('DATABASE_PASSWORD', ''),
        ssl: env.bool('DATABASE_SSL', false) && {
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
        },
      },
      pool: {
        min: env.int('DATABASE_POOL_MIN', 2),
        max: env.int('DATABASE_POOL_MAX', 10),
      },
    },
  };

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
