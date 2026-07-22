import { SectionHeader } from "./SectionHeader";
import { ShelfCard } from "./ShelfCard";

export function ShowingNow({ movies }) {
  const showingMovies = movies.filter((movie) => !movie.status || movie.status === "showing").slice(0, 4);

  return (
    <section className="catalog-section">
      <SectionHeader title="Showing Now" />
      <div className="movie-shelf">
        {showingMovies.map((movie) => (
          <ShelfCard key={movie.title} movie={movie} />
        ))}
      </div>
    </section>
  );
}
