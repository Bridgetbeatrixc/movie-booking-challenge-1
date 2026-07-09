export function MovieCard({ movie, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(movie)}
      className={`movie-card overflow-hidden rounded-xl border bg-navy text-left ${
        selected ? "selected border-blue-400" : "border-slate-700"
      }`}
    >
      <img src={movie.poster} alt={movie.title} className="h-64 w-full object-cover object-top" />
      <div className="p-4">
        <h3 className="font-semibold">{movie.title}</h3>
        <p className="mt-1 text-sm text-slate-400">
          {movie.genres} · {movie.runtime} · ★ {movie.rating}
        </p>
      </div>
    </button>
  );
}
