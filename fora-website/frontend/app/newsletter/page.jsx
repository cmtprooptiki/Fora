import { getSiteSettings } from '../../lib/strapi';
import { mediaUrl } from '../../lib/strapi';

export const metadata = {
  title: 'Εγγραφή στο Newsletter | FORA',
  description:
    'Εγγραφείτε στο newsletter του FORA – Innovating Healthcare Management για νέα και ανακοινώσεις της διοργάνωσης.',
};

// Η φόρμα στέλνει ΑΠΕΥΘΕΙΑΣ στο Mailchimp (κλασικό POST). Δεν χρειάζεται
// JavaScript ούτε κλειδί API: μετά την υποβολή ο επισκέπτης βλέπει τη σελίδα
// επιβεβαίωσης του Mailchimp.
const MAILCHIMP_ACTION =
  'https://cmtprooptiki.us20.list-manage.com/subscribe/post?u=b51df3af774349fd3c01f5069&id=0f59b3d064&v_id=5604&f_id=00245deef0';

// Το «δόλωμα» κατά των bot: κρυφό πεδίο που οι άνθρωποι δεν συμπληρώνουν ποτέ.
// Το όνομά του είναι συγκεκριμένο για τη λίστα και ΔΕΝ πρέπει να αλλάξει.
const HONEYPOT = 'b_b51df3af774349fd3c01f5069_0f59b3d064';

export default async function NewsletterPage() {
  const settings = await getSiteSettings();
  const logo = settings?.logotypo?.url ? mediaUrl(settings.logotypo.url) : null;

  return (
    <section className="nlp">
      <div className="nlp__card">
        {logo && (
          <img className="nlp__logo" src={logo} alt="FORA – Innovating Healthcare Management" />
        )}

        <form
          className="nlp__form"
          action={MAILCHIMP_ACTION}
          method="post"
          id="mc-embedded-subscribe-form"
          name="mc-embedded-subscribe-form"
          target="_self"
        >
          <h1 className="nlp__title">
            Εγγραφείτε στο <strong>Newsletter μας</strong>
          </h1>

          <div className="nlp__fields">
            <div className="nlp__row">
              <label className="nlp__label" htmlFor="mce-EMAIL">
                Διεύθυνση Email *
              </label>
              <input
                className="nlp__input"
                type="email"
                name="EMAIL"
                id="mce-EMAIL"
                placeholder="to.email@σας.com"
                required
              />
            </div>

            <div className="nlp__row">
              <label className="nlp__label" htmlFor="mce-MMERGE1">
                Όνομα
              </label>
              <input className="nlp__input" type="text" name="MMERGE1" id="mce-MMERGE1" />
            </div>

            <div className="nlp__row">
              <label className="nlp__label" htmlFor="mce-MMERGE2">
                Επώνυμο
              </label>
              <input className="nlp__input" type="text" name="MMERGE2" id="mce-MMERGE2" />
            </div>
          </div>

          <div className="nlp__perm">
            <div className="nlp__perm-head">
              <p className="nlp__perm-title">Άδειες Επικοινωνίας</p>
              <p className="nlp__perm-desc">
                Επιλέξτε τους τρόπους με τους οποίους θα θέλατε να επικοινωνούμε μαζί σας:
              </p>
            </div>
            <label className="nlp__check" htmlFor="gdpr_67018">
              <input
                type="checkbox"
                id="gdpr_67018"
                name="gdpr[67018]"
                value="Y"
                className="nlp__checkbox"
              />
              <span>Email</span>
            </label>
          </div>

          <div className="nlp__legal">
            <p>
              Μπορείτε να διαγραφείτε ανά πάσα στιγμή κάνοντας κλικ στον σύνδεσμο στο κάτω
              μέρος των email μας. Για πληροφορίες σχετικά με την πολιτική απορρήτου μας,
              επισκεφθείτε την ιστοσελίδα μας.
            </p>
            <p>
              Χρησιμοποιούμε το Mailchimp ως πλατφόρμα μάρκετινγκ. Κάνοντας κλικ παρακάτω
              για εγγραφή, αναγνωρίζετε ότι τα στοιχεία σας θα μεταφερθούν στο Mailchimp
              για επεξεργασία.{' '}
              <a href="https://mailchimp.com/legal/terms" target="_blank" rel="noopener noreferrer">
                Μάθετε περισσότερα
              </a>{' '}
              για τις πρακτικές απορρήτου του Mailchimp.
            </p>
          </div>

          {/* Ετικέτα λίστας — απαιτείται από το Mailchimp */}
          <input type="hidden" name="tags" value="4269968" />

          {/* Κρυφό πεδίο κατά των bot: ΔΕΝ το βλέπει ο χρήστης */}
          <div aria-hidden="true" className="nlp__hp">
            <input type="text" name={HONEYPOT} tabIndex={-1} defaultValue="" />
          </div>

          <button type="submit" name="subscribe" id="mc-embedded-subscribe" className="nlp__submit">
            Εγγραφή
          </button>
        </form>
      </div>
    </section>
  );
}
