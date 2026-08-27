'use strict';

/**
 * Αυτόματη ρύθμιση δικαιωμάτων ανάγνωσης.
 *
 * Όταν ξεκινά το Strapi, δίνει αυτόματα στον δημόσιο ρόλο ("Public")
 * δικαίωμα να ΔΙΑΒΑΖΕΙ τα Forums και τις Ρυθμίσεις Ιστότοπου, και να
 * ΔΕΧΕΤΑΙ εγγραφές newsletter. Έτσι ο δημόσιος ιστότοπος (Astro) μπορεί
 * να τραβήξει το περιεχόμενο χωρίς να χρειάζεται να ρυθμίσετε κωδικούς/tokens.
 *
 * Δεν χρειάζεται να πειράξετε τίποτα εδώ.
 */

const PUBLIC_PERMISSIONS = {
  'api::forum.forum': ['find', 'findOne'],
  'api::site-setting.site-setting': ['find'],
  'api::newsletter-subscriber.newsletter-subscriber': ['create'],
};

module.exports = {
  register(/* { strapi } */) {},

  async bootstrap({ strapi }) {
    try {
      const publicRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' } });

      if (!publicRole) return;

      for (const [uid, actions] of Object.entries(PUBLIC_PERMISSIONS)) {
        for (const action of actions) {
          const actionId = `${uid}.${action}`;

          const existing = await strapi
            .query('plugin::users-permissions.permission')
            .findOne({ where: { action: actionId, role: publicRole.id } });

          if (!existing) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: { action: actionId, role: publicRole.id },
            });
            strapi.log.info(`[FORA] Δόθηκε δημόσιο δικαίωμα: ${actionId}`);
          }
        }
      }
    } catch (err) {
      strapi.log.error('[FORA] Σφάλμα κατά τη ρύθμιση δικαιωμάτων:', err);
    }
  },
};
