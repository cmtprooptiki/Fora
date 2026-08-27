'use strict';

// Ενεργοποιεί τον επιλογέα χρώματος (color picker) στον πίνακα διαχείρισης,
// ώστε να διαλέγετε χρώμα με το ποντίκι αντί να πληκτρολογείτε κωδικό.
//
// Το ενεργοποιούμε ΜΟΝΟ αν το πρόσθετο είναι εγκατεστημένο, ώστε το Strapi
// να ξεκινά κανονικά ακόμη κι αν δεν έχει γίνει ακόμη το `npm install`.
let colorPickerAvailable = false;
try {
  require.resolve('@strapi/plugin-color-picker');
  colorPickerAvailable = true;
} catch (e) {
  colorPickerAvailable = false;
}

module.exports = () => ({
  ...(colorPickerAvailable ? { 'color-picker': { enabled: true } } : {}),
});
