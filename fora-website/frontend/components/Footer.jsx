export default function Footer({ settings }) {
  const email = settings?.emailEpikoinonias;
  const phone = settings?.tilefonoEpikoinonias;
  const copyright =
    settings?.keimenoFooter || '© 2025 CMT Prooptiki All Rights Reserved.';
  const mailHref = email ? `mailto:${email}` : '#';
  const telHref = phone ? `tel:${phone.replace(/\s+/g, '')}` : '#';
  const joinHref = email
    ? `mailto:${email}?subject=${encodeURIComponent('Εγγραφή στο Newsletter')}`
    : '#';

  return (
    <footer className="site-footer">
      {/* CTA επικοινωνίας */}
      <section className="cta" id="epikoinonia">
        <div className="container cta__inner">
          <div className="cta__head">
            <h2 className="cta__title">
              Έχετε
              <br />
              Ερωτήσεις;
            </h2>
            <p className="cta__desc">
              Η ομάδα μας είναι στη διάθεσή σας για οποιαδήποτε ερώτηση σχετικά με
              το Forum και την εγγραφή σας.
            </p>
          </div>
          <div className="cta__buttons">
            <a href={mailHref} className="btn btn--primary">
              Στείλτε μας Email
            </a>
            <a href={telHref} className="btn btn--outline">
              Καλέστε μας εδώ
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="foot">
        <div className="container foot__inner">
          <div className="foot__row foot__links-row">
            <span className="foot__label">Χρήσιμα Links</span>
            <nav className="foot__nav">
              <a href="/#analytiko-programma">Ατζέντα</a>
              <a href="/#eggrafi">Εγγραφή</a>
              <a href="/#newsletter">Νέα &amp; Ανακοινώσεις</a>
              <a href="/istoriko/">Σχετικά με το Forum</a>
            </nav>
          </div>

          <div className="foot__mid" id="newsletter">
            <p className="foot__news-text">
              Γραφτείτε στο newsletter μας και μάθετε πρώτοι για ανακοινώσεις,
              προγράμματα και νέες δράσεις του Forum.
            </p>
            <div className="foot__news">
              <h3 className="foot__news-head">
                <span className="foot__news-faint">Μην χάσετε καμία ενημέρωση</span>
                <span>
                  <span className="foot__news-strong">Γραφτείτε</span>{' '}
                  <span className="foot__news-faint">τώρα στο newsletter μας</span>
                </span>
              </h3>
              <a href={joinHref} className="btn btn--white foot__join">
                Γινετέ Μέλος
              </a>
            </div>
          </div>

          <div className="foot__row foot__bottom">
            <span>{copyright}</span>
            <div className="foot__legal">
              <a href="#">Όροι Χρήσης</a>
              <a href="#">Πολιτική Απορρήτου</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
