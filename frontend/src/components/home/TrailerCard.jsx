export function TrailerCard({ movie }) {
  return (
    <article className="trailer-card">
      <div className="trailer-media">
        <img src={movie.poster} alt={`${movie.title} trailer`} />
        <span className="trailer-shade" />
        <span className="play-button" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="m9 7 7 5-7 5V7Z" fill="currentColor" />
          </svg>
        </span>
        <span className="trailer-label">Trailer</span>
      </div>
      <div className="trailer-copy">
        <h3>{movie.title}</h3>
        <p>{movie.release}</p>
      </div>
    </article>
  );
}
