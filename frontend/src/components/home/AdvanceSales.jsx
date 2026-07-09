import { advanceSaleMovies } from "../../data/movies";
import { SectionHeader } from "./SectionHeader";

export function AdvanceSales({ movies = [] }) {
  const apiAdvanceMovies = movies.filter((movie) => movie.status === "advance-sale");
  const displayMovies = apiAdvanceMovies.length >= 4 ? apiAdvanceMovies.slice(0, 4) : advanceSaleMovies;

  return (
    <section className="catalog-section catalog-section-last">
      <SectionHeader title="Advance Ticket Sales" />
      <div className="movie-shelf">
        {displayMovies.map((movie) => (
          <article className="shelf-card" key={movie.title}>
            <img src={movie.poster} alt={movie.title} />
            <h3>{movie.shortTitle || movie.title}</h3>
            <p className="movie-meta">
              <span>From Rp35.000</span>
              <span className="advance-badge">Advance</span>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
