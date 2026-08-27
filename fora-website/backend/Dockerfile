# ============================================================================
#  FORA – Strapi (backend)
#  Βάση: node:20-slim (Debian). ΓΙΑΤΙ ΟΧΙ alpine: τα πακέτα "sharp" (επεξεργασία
#  εικόνων) και "better-sqlite3" (βάση) έχουν έτοιμα (prebuilt) binaries για
#  Debian/glibc, μαζί με τη libvips. Στο alpine χτίζονταν από τον κώδικα και
#  έσπαγαν με σφάλμα «libvips-cpp.so.42: No such file or directory».
#
#  ΠΡΟΣΟΧΗ: ΟΥΤΕ η βάση (.tmp/data.db) ΟΥΤΕ τα ανεβασμένα αρχεία
#  (public/uploads) μπαίνουν στην εικόνα — έρχονται από Docker volumes.
# ============================================================================
FROM node:20-slim AS builder
WORKDIR /app

# Εργαλεία μόνο για την περίπτωση που κάποιο πακέτο χρειαστεί μεταγλώττιση.
RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 make g++ ca-certificates \
 && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .
# Χτίζει τον πίνακα διαχείρισης (admin panel).
RUN NODE_ENV=production npm run build
# Πετάει τις βιβλιοθήκες που χρειάζονταν μόνο για το build.
RUN npm prune --omit=dev


FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# Αντιγράφουμε την έτοιμη εφαρμογή (κώδικας + node_modules + admin build).
COPY --from=builder /app ./

# Δημιουργούμε τους φακέλους των μόνιμων δεδομένων. Τα ΠΡΑΓΜΑΤΙΚΑ δεδομένα
# έρχονται από τα volumes (strapi_db, strapi_uploads) — εδώ μένουν κενοί.
RUN mkdir -p /app/.tmp /app/public/uploads

EXPOSE 1337
CMD ["npm", "run", "start"]
