# FORA – Οδηγός εγκατάστασης στον διακομιστή (Docker + Portainer)

Στόχος: ο ιστότοπος να τρέχει στον Ubuntu διακομιστή και **να μη χάνονται ποτέ
δεδομένα** όταν ανεβάζετε νέα έκδοση.

**Πού ζουν τα δεδομένα σας:** σε δύο Docker *named volumes*:

| Volume | Τι περιέχει |
|---|---|
| `strapi_db` | Το αρχείο της βάσης SQLite (`/app/.tmp/data.db`) |
| `strapi_uploads` | Όλες τις εικόνες/αρχεία που ανεβάζετε (`/app/public/uploads`) |

Αυτά **δεν** αγγίζονται όταν ξαναχτίζονται οι εικόνες.

---

## ΒΗΜΑ 0 — Μετονομασία δύο φακέλων (κάντε το εσείς, μία φορά)

Μέσα στο `Fora\fora-website\` μετονομάστε:

- `nextjs`  →  **`frontend`**
- `strapi`  →  **`backend`**

Το `docker-compose.yml` δείχνει σε αυτά τα ονόματα.

---

## ΒΗΜΑ 1 — Δημιουργήστε τα μυστικά κλειδιά (μία φορά)

Σε ένα τερματικό στον υπολογιστή σας:

```bash
# APP_KEYS (4 κλειδιά με κόμμα)
node -e "console.log([1,2,3,4].map(()=>require('crypto').randomBytes(16).toString('base64')).join(','))"

# Και ένα ξεχωριστό για κάθε ένα από τα υπόλοιπα:
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
```

Τρέξτε τη δεύτερη εντολή **5 φορές** και κρατήστε τις τιμές για:
`API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`, `ENCRYPTION_KEY`.

> Αποθηκεύστε τα σε ασφαλές μέρος (password manager). **Ποτέ στο git.**
> Αν χαθεί το `ADMIN_JWT_SECRET`, θα χρειαστεί νέα σύνδεση στο admin.
> Αν αλλάξει το `ENCRYPTION_KEY`, χάνεται η πρόσβαση σε κρυπτογραφημένα πεδία.

---

## ΒΗΜΑ 2 — Έλεγχος πριν το git (να μη φύγει τίποτα κρίσιμο)

Από τον φάκελο `Fora`:

```bash
# Δεν πρέπει να εμφανιστεί .env ούτε αρχείο βάσης
git init
git add .
git status
```

Στη λίστα **δεν** πρέπει να υπάρχει:
- `fora-website/backend/.env`
- οτιδήποτε `.db` / `.sqlite`
- `.tmp/`
- `node_modules/`
- `public/uploads/` (εκτός από το `.gitkeep`)

Αν όλα είναι καθαρά:

```bash
git commit -m "Initial commit"
git remote add origin <GitHub HTTPS URL>
git push -u origin main
```

> Πείτε μου πριν το push αν θέλετε να τα τρέξω εγώ — δεν εκτελώ εντολές git/docker χωρίς έγκριση.

---

## ΒΗΜΑ 3 — Portainer: δημιουργία stack

1. Portainer → **Stacks** → **Add stack** → **Repository**
2. **Repository URL**: το GitHub HTTPS URL σας
3. **Compose path**: `docker-compose.yml`
4. **Environment variables** — προσθέστε ΟΛΕΣ:

| Μεταβλητή | Τιμή (παράδειγμα) |
|---|---|
| `APP_KEYS` | `abc==,def==,ghi==,jkl==` (τα 4 από το ΒΗΜΑ 1) |
| `API_TOKEN_SALT` | τυχαίο |
| `ADMIN_JWT_SECRET` | τυχαίο |
| `TRANSFER_TOKEN_SALT` | τυχαίο |
| `JWT_SECRET` | τυχαίο |
| `ENCRYPTION_KEY` | τυχαίο |
| `NEXT_PUBLIC_STRAPI_URL` | `http://SERVER_IP:1337` |
| `NEXT_PUBLIC_SITE_URL` | `http://SERVER_IP:3003` |
| `CORS_ORIGINS` | `http://SERVER_IP:3003` |

5. **Deploy the stack**
6. Παρακολουθήστε: Containers → `fora_backend` → **Logs**

**Διευθύνσεις μετά την εγκατάσταση**
- Ιστότοπος: `http://SERVER_IP:3003`
- Πίνακας διαχείρισης Strapi: `http://SERVER_IP:1337/admin`

Την **πρώτη φορά** στο `/admin` δημιουργείτε τον λογαριασμό διαχειριστή.

### Αν το backend δεν ξεκινά
- `APP_KEYS is required` → λείπει μεταβλητή στο Portainer.
- Πρέπει να είναι **4** κλειδιά χωρισμένα με κόμμα.
- `ENCRYPTION_KEY` → υποχρεωτικό στο Strapi 5.

---

## ΒΗΜΑ 4 — Ενημέρωση χωρίς απώλεια δεδομένων

1. Κάντε push τις αλλαγές στο GitHub.
2. Portainer → Stacks → το stack σας → **Pull and redeploy** (ή Editor → *Update the stack* με **Re-pull image**).
3. Οι εικόνες ξαναχτίζονται, τα containers ξεκινούν από την αρχή.
4. Τα `strapi_db` και `strapi_uploads` **παραμένουν ως είναι** — τα δεδομένα σώα.

**Απαγορευμένες εντολές**

```bash
docker volume rm strapi_db              # ΣΒΗΝΕΙ ΤΗ ΒΑΣΗ
docker system prune -a --volumes        # ΣΒΗΝΕΙ ΤΑ VOLUMES
```

**Ασφαλής καθαριότητα**

```bash
docker system prune -a                  # χωρίς --volumes
```

---

## ΒΗΜΑ 5 — Μεταφορά της υπάρχουσας βάσης (μία φορά)

Αν έχετε ήδη περιεχόμενο τοπικά (`fora-website/backend/.tmp/data.db`):

1. Ανεβάστε το stack μία φορά (για να δημιουργηθεί το volume).
2. Portainer → `fora_backend` → **Stop**.
3. Ανεβάστε το τοπικό αρχείο στον διακομιστή (π.χ. με WinSCP) και μετά:

```bash
docker cp /path/to/data.db fora_backend:/app/.tmp/data.db
# Και τα ανεβασμένα αρχεία (αν έχετε):
docker cp /path/to/uploads/. fora_backend:/app/public/uploads/
```

4. Portainer → `fora_backend` → **Start**.

Από εκείνη τη στιγμή το volume κρατά τα δεδομένα μόνιμα.

### Αντίγραφο ασφαλείας (καλή συνήθεια)

```bash
docker cp fora_backend:/app/.tmp/data.db ./backup-$(date +%F).db
docker cp fora_backend:/app/public/uploads ./uploads-backup-$(date +%F)
```

---

## ΒΗΜΑ 6 — Nginx (όταν αποκτήσετε domains)

Πρότυπο — αντικαταστήστε τα domains:

```nginx
# Strapi (πίνακας διαχείρισης / API)
server {
    listen 80;
    server_name admin.example.gr;
    client_max_body_size 100M;   # για ανέβασμα μεγάλων φωτογραφιών
    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Next.js (δημόσιος ιστότοπος)
server {
    listen 80;
    server_name www.example.gr;
    location / {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

Μετά τα domains, **αλλάξτε στο Portainer** τα:
`NEXT_PUBLIC_STRAPI_URL=https://admin.example.gr`,
`NEXT_PUBLIC_SITE_URL=https://www.example.gr`,
`CORS_ORIGINS=https://www.example.gr`
και κάντε **redeploy** (το `NEXT_PUBLIC_STRAPI_URL` «ψήνεται» στην εικόνα, άρα
χρειάζεται νέο build του frontend).

---

## Σημαντικές σημειώσεις

- **Ο ιστότοπος διαβάζει το Strapi ζωντανά.** Ό,τι αλλάζετε στο Strapi
  εμφανίζεται **αμέσως** με ένα refresh — δεν χρειάζεται νέα έκδοση.
  (Αν θέλετε προσωρινή αποθήκευση για ταχύτητα, βάλτε
  `CONTENT_REVALIDATE_SECONDS=60` στο Portainer.)
- **Η βάση είναι SQLite.** Δουλεύει άριστα για έναν ιστότοπο σαν αυτόν.
  Αν κάποτε θέλετε PostgreSQL, ο κώδικας το υποστηρίζει ήδη
  (`DATABASE_CLIENT=postgres` + στοιχεία σύνδεσης).
- **Θύρες:** frontend `3003`, Strapi `1337`. Αν κάποια είναι πιασμένη,
  αλλάξτε ΜΟΝΟ το αριστερό μέρος στο `docker-compose.yml` (π.χ. `3004:3000`).
