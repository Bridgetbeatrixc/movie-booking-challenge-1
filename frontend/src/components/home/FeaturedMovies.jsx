import { MovieCard } from "./MovieCard";

export function FeaturedMovies({ movies, moviesError, moviesLoading, selectedMovie, setSelectedMovie }) {
  return (
    <section id="movies" className="mx-auto max-w-7xl px-6 pb-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-300">FEATURED MOVIE</p>
          <h2 className="mt-1 text-3xl font-semibold">Choose your movie</h2>
        </div>
        <span className="text-sm text-slate-400">{moviesLoading ? "Loading from MongoDB..." : "Pick one to book seats"}</span>
      </div>
      {moviesError ? <p className="mb-4 rounded-lg border border-amber-400/30 bg-amber-950/40 p-3 text-sm text-amber-100">Using local sample movies because API is offline: {moviesError}</p> : null}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {movies.map((movie) => (
          <MovieCard
            key={movie.title}
            movie={movie}
            selected={selectedMovie.title === movie.title}
            onSelect={setSelectedMovie}
          />
        ))}
      </div>

      <div className="mt-7 flex items-center justify-between rounded-xl border border-blue-400/40 bg-blue-950/50 p-4">
        <p>
          Selected movie: <strong className="text-blue-200">{selectedMovie.title}</strong>
        </p>
        <a href="#booking" className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold hover:bg-blue-500">
          Choose seats →
        </a>
      </div>
    </section>
  );
}
