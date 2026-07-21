export function BookingHero({ movie }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-blue-300/20 bg-[#06152d] p-6 shadow-2xl md:p-9">
      <div className="absolute inset-0 bg-[url('/assets/cinema-hero-v2.png')] bg-cover bg-center opacity-20" />
      <div className="relative grid items-center gap-6 md:grid-cols-[150px_1fr]">
        <img src={movie.poster} alt={`${movie.title} poster`} className="h-48 w-36 rounded-lg object-cover shadow-xl" />
        <div>
          <p className="text-sm font-semibold tracking-[.25em] text-blue-300">NOW BOOKING</p>
          <h1 className="mt-2 text-4xl font-semibold">{movie.title}</h1>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
            <span className="rounded bg-slate-800 px-3 py-1">{movie.genres}</span>
            <span className="rounded bg-slate-800 px-3 py-1">{movie.runtime}</span>
            <span className="rounded bg-slate-800 px-3 py-1">★ {movie.rating}/10</span>
          </div>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
            A cinematic adventure awaits. Choose a showtime, select your favourite seats, and enjoy the big screen.
          </p>
        </div>
      </div>
    </section>
  );
}
