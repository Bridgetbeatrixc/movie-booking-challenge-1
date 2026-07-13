import { useEffect, useState } from "react";
import { Footer } from "../components/layout/Footer.jsx";
import { Header } from "../components/layout/Header.jsx";
import { getMovieById } from "../features/movies/api/movieApi.js";
import { asset } from "../features/movies/data/movies.js";
import { formatRupiah } from "../utils/currency.js";

function getGenres(movie = {}) {
  return Array.isArray(movie.genres) ? movie.genres.join(" / ") : movie.genres;
}

const trailerVideoIds = {
  "breaking-dawn-part-2": "Ocz50YJOFTM",
  "another-earth": "N8hEwMMDtFY",
  arrival: "tFMo3UJ4B4g",
  annabelle: "paFgQNPGlsg",
  "the-nun": "pzD9zGcUNrw"
};

function getTrailerVideoId(movie = {}) {
  const movieKey = movie.key || movie.slug || "";
  return movie.trailerVideoId || trailerVideoIds[movieKey] || "";
}

export function MovieDetailPage({ movieKey, selectedMovie, setSelectedMovie }) {
  const [movie, setMovie] = useState(selectedMovie);
  const [loading, setLoading] = useState(Boolean(movieKey));
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadMovieDetail() {
      if (!movieKey) {
        setMovie(selectedMovie);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await getMovieById(movieKey);
        if (active) {
          setMovie(response);
          setSelectedMovie?.(response);
        }
      } catch (requestError) {
        if (active) {
          setMovie(selectedMovie);
          setError(requestError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadMovieDetail();

    return () => {
      active = false;
    };
  }, [movieKey]);

  const genres = getGenres(movie);
  const trailerVideoId = getTrailerVideoId(movie);
  const trailerUrl = trailerVideoId
    ? `https://www.youtube.com/embed/${trailerVideoId}?autoplay=1&mute=0&controls=1&playsinline=1&rel=0&loop=1&playlist=${trailerVideoId}&enablejsapi=1`
    : "";

  return (
    <div className="movie-detail-page min-h-screen text-slate-100">
      <Header booking />
      <main>
        <section className="movie-trailer-hero">
          <div className="movie-trailer-frame" aria-label={`${movie.title} trailer preview`}>
            {trailerUrl ? (
              <iframe
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="movie-trailer-video"
                src={trailerUrl}
                title={`${movie.title} trailer`}
              />
            ) : (
              <>
                <img className="movie-trailer-backdrop" src={asset("cinema-hero-v2.png")} alt="" />
                <img className="movie-trailer-poster" src={movie.poster} alt={`${movie.title} poster`} />
                <div className="movie-trailer-vignette" />
                <div className="movie-trailer-scanline" />
                <div className="movie-trailer-copy">
                  <p>Trailer Preview</p>
                  <h1>{movie.title}</h1>
                  <span className="movie-play-button" aria-hidden="true">
                    <span />
                  </span>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[260px_1fr]">
          <aside>
            <img className="w-full rounded-xl border border-blue-300/20 object-cover shadow-2xl" src={movie.poster} alt={movie.title} />
            <a
              className="mt-5 block rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-semibold hover:bg-blue-500"
              href="#booking"
            >
              Choose showtime
            </a>
          </aside>

          <article className="min-w-0">
            <p className="text-sm font-semibold tracking-[.25em] text-blue-300">MOVIE DETAIL</p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight">{movie.title}</h2>
            {loading ? <p className="mt-3 text-sm text-blue-200">Loading movie detail from MongoDB...</p> : null}
            {error ? (
              <p className="mt-3 rounded-lg border border-amber-400/30 bg-amber-950/40 p-3 text-sm text-amber-100">
                Movie detail could not be refreshed from the API: {error}
              </p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
              {genres ? <span className="rounded bg-slate-800 px-3 py-1">{genres}</span> : null}
              {movie.runtime ? <span className="rounded bg-slate-800 px-3 py-1">{movie.runtime}</span> : null}
              {movie.year ? <span className="rounded bg-slate-800 px-3 py-1">{movie.year}</span> : null}
              {movie.rating ? <span className="rounded bg-slate-800 px-3 py-1">Rating {movie.rating}/10</span> : null}
              <span className="rounded bg-slate-800 px-3 py-1">{formatRupiah(movie.price || 35000)}</span>
            </div>

            <div className="mt-8 rounded-xl border border-slate-700 bg-[#06152d] p-6">
              <h3 className="text-xl font-semibold">Description</h3>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
                {movie.description || "Movie description is not available yet."}
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <InfoBox label="Genre" value={genres || "TBA"} />
              <InfoBox label="Duration" value={movie.runtime || "TBA"} />
              <InfoBox label="Ticket From" value={formatRupiah(movie.price || 35000)} />
            </div>
          </article>
        </section>
      </main>
      <Footer compact />
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/35 p-4">
      <p className="text-xs font-semibold uppercase tracking-[.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-100">{value}</p>
    </div>
  );
}
