export function ShelfCard({ movie }) {
  return (
    <article className="shelf-card">
      <img src={movie.poster} alt={movie.title} />
      <h3>{movie.shortTitle || movie.title}</h3>
      <p className="movie-meta">
        <span>{movie.year}</span>
        <span className="meta-rating">★ {movie.rating}</span>
      </p>
    </article>
  );
}
