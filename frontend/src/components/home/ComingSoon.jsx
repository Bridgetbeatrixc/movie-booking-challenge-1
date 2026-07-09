import { comingSoonMovies } from "../../data/movies";
import { SectionHeader } from "./SectionHeader";
import { TrailerCard } from "./TrailerCard";

export function ComingSoon({ movies = [] }) {
  const apiComingSoon = movies.filter((movie) => movie.status === "coming-soon" || movie.status === "advance-sale");
  const displayMovies = apiComingSoon.length >= 3 ? apiComingSoon.slice(0, 3) : comingSoonMovies;

  return (
    <section id="coming-soon" className="catalog-section">
      <SectionHeader title="Coming Soon" />
      <div className="trailer-grid">
        {displayMovies.map((movie) => (
          <TrailerCard key={movie.title} movie={movie} />
        ))}
      </div>
    </section>
  );
}
