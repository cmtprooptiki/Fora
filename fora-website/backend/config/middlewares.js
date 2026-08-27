module.exports = ({ env }) => [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      // Ποιες ιστοσελίδες επιτρέπεται να διαβάζουν το περιεχόμενο.
      // Προσθέστε εδώ τη διεύθυνση του δημόσιου ιστότοπού σας.
      origin: env.array('CORS_ORIGINS', ['http://localhost:4321']),
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      // Αυξημένο όριο ώστε να ανεβαίνουν άνετα μεγάλες φωτογραφίες.
      formLimit: '256mb',
      jsonLimit: '256mb',
      textLimit: '256mb',
      formidable: {
        maxFileSize: 250 * 1024 * 1024,
      },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
