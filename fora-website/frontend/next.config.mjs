/** @type {import('next').NextConfig} */

// Λειτουργία "standalone": το build παράγει έναν αυτόνομο διακομιστή
// (.next/standalone/server.js) που τρέχει μέσα στο Docker. Έτσι ο ιστότοπος
// διαβάζει το Strapi ΤΗΝ ΩΡΑ ΠΟΥ ΤΟΝ ΕΠΙΣΚΕΠΤΟΝΤΑΙ — οπότε ό,τι αλλάζετε στο
// Strapi εμφανίζεται με ένα refresh, χωρίς να ξαναφτιάχνουμε την εικόνα.
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  images: {
    // Χρησιμοποιούμε απλές <img> με εικόνες από το Strapi· χωρίς επεξεργασία.
    unoptimized: true,
  },
};

export default nextConfig;
