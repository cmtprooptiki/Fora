export default function Contact({ settings }) {
  const email = settings?.emailEpikoinonias;
  const phone = settings?.tilefonoEpikoinonias;
  const text =
    settings?.keimenoEpikoinonias ||
    'Η ομάδα μας είναι στη διάθεσή σας για οποιαδήποτε ερώτηση σχετικά με το Forum και την εγγραφή σας.';

  return (
    <section className="section section--blue" id="epikoinonia">
      <div className="container contact">
        <div className="contact__intro">
          <span className="section__eyebrow" style={{ color: '#8fd0ff' }}>
            Επικοινωνία
          </span>
          <h2>Έχετε ερωτήσεις;</h2>
          <p>{text}</p>
        </div>
        <div className="contact__cards">
          {email && (
            <a className="contact__card" href={`mailto:${email}`}>
              <span className="contact__label">Στείλτε μας Email</span>
              <span className="contact__value">{email}</span>
            </a>
          )}
          {phone && (
            <a className="contact__card" href={`tel:${phone.replace(/\s+/g, '')}`}>
              <span className="contact__label">Καλέστε μας εδώ</span>
              <span className="contact__value">{phone}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
