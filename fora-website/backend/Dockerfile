# ============================================================================
#  FORA – Strapi (backend)
#  Δύο στάδια: (1) εγκατάσταση + build του πίνακα διαχείρισης, (2) τελική εικόνα.
#  ΠΡΟΣΟΧΗ: ΟΥΤΕ η βάση (.tmp/data.db) ΟΥΤΕ τα ανεβασμένα αρχεία
#  (public/uploads) μπαίνουν στην εικόνα — έρχονται από Docker volumes.
# ============================================================================
FROM node:20-alpine AS builder
WORKDIR /app

# Το better-sqlite3 και το sharp είναι "native" και θέλουν εργαλεία μεταγλώττισης.
RUN apk add --no-cache build-base python3 libc6-compat vips-dev

COPY package*.json ./
RUN npm ci

COPY . .
# Χτίζει τον πίνακα διαχείρισης (admin panel).
RUN NODE_ENV=production npm run build
# Πετάει τις βιβλιοθήκες που χρειάζονταν μόνο για το build.
RUN npm prune --omit=dev


FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Βιβλιοθήκες που χρειάζονται τα native modules κατά την εκτέλεση.
RUN apk add --no-cache libc6-compat vips

# Αντιγράφουμε την έτοιμη εφαρμογή (κώδικας + node_modules + admin build).
COPY --from=builder /app ./

# Δημιουργούμε τους φακέλους των μόνιμων δεδομένων. Τα ΠΡΑΓΜΑΤΙΚΑ δεδομένα
# έρχονται από τα volumes (strapi_db, strapi_uploads) — εδώ μένουν κενοί.
RUN mkdir -p /app/.tmp /app/public/uploads

EXPOSE 1337
CMD ["npm", "run", "start"]
