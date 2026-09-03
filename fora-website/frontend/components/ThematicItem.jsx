// Μία θεματική ενότητα ως γραμμή.
//
// Καθαρά παρουσιαστικό component: ΔΕΝ μετράει μόνο του το scroll. Το πόσες
// λέξεις είναι «αναμμένες» το ορίζει ο ThematicList, ώστε η αποκάλυψη να
// γίνεται διαδοχικά — μία γραμμή τη φορά.
export default function ThematicItem({ words = [], perigrafi, label, active = 0 }) {
  return (
    <div className="thematic-row">
      <div className="thematic-row__main">
        <h3 className="thematic-row__title">
          {words.map((w, i) => (
            <span key={i} className={i < active ? 'is-on' : ''}>
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </h3>
        {perigrafi && <p className="thematic-row__desc">{perigrafi}</p>}
      </div>
      <span className="thematic-row__label">{label}</span>
    </div>
  );
}
