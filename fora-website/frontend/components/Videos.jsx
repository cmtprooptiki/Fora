import { youtubeId } from '../lib/strapi';

export default function Videos({ forum }) {
  const videos = (forum?.vinteo || [])
    .map((v) => ({ ...v, id: youtubeId(v.syndesmosYoutube) }))
    .filter((v) => v.id);
  if (videos.length === 0) return null;

  return (
    <section className="section" id="vinteo">
      <div className="container">
        <div className="section__head">
          <span className="section__eyebrow">Βίντεο</span>
          <h2>Βίντεο από το Forum</h2>
        </div>

        <div className="grid videos">
          {videos.map((v, i) => (
            <div className="video" key={i}>
              <div className="video__frame">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${v.id}`}
                  title={v.titlos || 'Βίντεο Forum'}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              {v.titlos && <p className="video__title">{v.titlos}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
