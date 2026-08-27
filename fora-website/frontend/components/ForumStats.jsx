// Λωρίδα με τους αριθμούς/στατιστικά της διοργάνωσης (Figma Frame 10).
// Τα δεδομένα ορίζονται ανά Forum στο Strapi (πεδίο «arithmoi»).
export default function ForumStats({ forum }) {
  const stats = forum?.arithmoi || [];
  if (stats.length === 0) return null;

  return (
    <section className="stats-band">
      <div className="container">
        <div className="stats-band__grid">
          {stats.map((s, i) => (
            <div className="stat" key={i}>
              <span className="stat__num">{s.arithmos}</span>
              <span className="stat__desc">{s.perigrafi}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
