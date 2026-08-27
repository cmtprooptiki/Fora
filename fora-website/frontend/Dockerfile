# ============================================================================
#  FORA – Next.js (frontend)
#  Λειτουργία "standalone": παράγεται αυτόνομος διακομιστής (server.js).
# ============================================================================
FROM node:20-alpine AS builder
WORKDIR /app

# Η ΔΗΜΟΣΙΑ διεύθυνση του Strapi «ψήνεται» στην εικόνα κατά το build, γιατί τη
# χρησιμοποιεί ο browser για τις εικόνες. Αν αλλάξει (νέο domain/IP), πρέπει να
# ξαναχτιστεί η εικόνα του frontend.
ARG NEXT_PUBLIC_STRAPI_URL
ENV NEXT_PUBLIC_STRAPI_URL=$NEXT_PUBLIC_STRAPI_URL
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Το "standalone" build περιέχει ό,τι χρειάζεται (μαζί με τα node_modules).
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
