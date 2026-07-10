import { Footer } from "../components/layout/Footer.jsx";
import { Header } from "../components/layout/Header.jsx";
import { advanceSaleMovies, comingSoonMovies } from "../features/movies/data/movies.js";
import { asset } from "../utils/assets.js";

export function HomePage({ movies, moviesError, moviesLoading, selectedMovie, setSelectedMovie }) {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Promos />
        <FeaturedMovies
          movies={movies}
          moviesError={moviesError}
          moviesLoading={moviesLoading}
          selectedMovie={selectedMovie}
          setSelectedMovie={setSelectedMovie}
        />
        <ComingSoon movies={movies} />
        <ShowingNow movies={movies} />
        <AdvanceSales movies={movies} />
      </main>
      <AppPromo />
      <Footer />
    </>
  );
}

function Hero() {
  const shortcuts = [
    { label: "Bioskop", href: "#movies", icon: "cinema-icon.png" },
    { label: "Film", href: "#movies", icon: "movie-icon.svg" },
    { label: "Snacks", href: "#snacks", icon: "snack-icon.svg" }
  ];

  return (
    <section className="hero-section relative min-h-[720px] overflow-hidden bg-[#020b1e] px-6 pt-40 text-center">
      <img
        src={asset("cinema-hero-v2.png")}
        alt="Futuristic Beatrix cinema experience"
        className="hero-image absolute inset-0 h-full w-full object-cover"
      />
      <div className="hero-overlay absolute inset-0" />
      <div className="hero-content relative z-10 mx-auto max-w-2xl">
        <p className="text-sm font-semibold tracking-[.35em] text-blue-200">BEATRIX MOVIE</p>
        <h1 className="mt-5 text-4xl font-light sm:text-6xl">
          Feel The
          <br />
          <strong className="font-semibold">Moment Beyond</strong>
        </h1>
        <p className="mt-4 text-sm text-slate-200">Your cinematic experience starts here.</p>
        <a
          href="#movies"
          className="mt-7 inline-block rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold shadow-lg shadow-blue-950 hover:bg-blue-500"
        >
          Explore movies
        </a>
      </div>
      <div className="hero-shortcuts absolute left-1/2 z-10 -translate-x-1/2 translate-y-1/2 sm:top-[58%]">
        {shortcuts.map((shortcut) => (
          <a className="hero-shortcut" href={shortcut.href} key={shortcut.label}>
            <img src={asset(shortcut.icon)} alt="" aria-hidden="true" />
            <span>{shortcut.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function Promos() {
  return (
    <section className="mx-auto grid max-w-7xl gap-4 px-6 py-10 md:grid-cols-3">
      <PromoCard
        cardClass="from-cyan-950 to-sky-900"
        id="snacks"
        image={asset("snack-combo.png")}
        imageClass="absolute bottom-0 right-0 h-32"
        text={
          <>
            Buy 1 BIG Popcorn
            <br />
            Free Chicken + Fries
          </>
        }
        title="Snack Time"
      />
      <PromoCard
        cardClass="from-violet-950 to-violet-700"
        image={asset("the-nun.png")}
        imageClass="absolute bottom-0 right-5 h-32"
        text="Your next big story begins here."
        title="Movie Premiere"
      />
      <PromoCard
        cardClass="from-blue-900 to-slate-950"
        image={asset("imax-theater.png")}
        imageClass="absolute bottom-0 right-0 h-36 w-32 object-cover"
        text="Bigger screen. Bigger sound."
        title="Feel It In IMAX"
      />
    </section>
  );
}

function PromoCard({ cardClass, id, image, imageClass, text, title }) {
  return (
    <article
      className={`relative min-h-36 overflow-hidden rounded-xl border border-cyan-300/20 bg-gradient-to-r p-5 ${cardClass}`}
      id={id}
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-slate-300">{text}</p>
      <img src={image} alt="" className={imageClass} />
      <a className="mt-8 inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-900" href="#movies">
        See movies
      </a>
    </article>
  );
}

function FeaturedMovies({ movies, moviesError, moviesLoading, selectedMovie, setSelectedMovie }) {
  return (
    <section id="movies" className="mx-auto max-w-7xl px-6 pb-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-300">FEATURED MOVIE</p>
          <h2 className="mt-1 text-3xl font-semibold">Choose your movie</h2>
        </div>
        <span className="text-sm text-slate-400">{moviesLoading ? "Loading from MongoDB..." : "Pick one to book seats"}</span>
      </div>
      {moviesError ? (
        <p className="mb-4 rounded-lg border border-amber-400/30 bg-amber-950/40 p-3 text-sm text-amber-100">
          Using local sample movies because API is offline: {moviesError}
        </p>
      ) : null}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {movies.map((movie) => (
          <button
            className={`movie-card overflow-hidden rounded-xl border bg-navy text-left ${
              selectedMovie.title === movie.title ? "selected border-blue-400" : "border-slate-700"
            }`}
            key={movie.title}
            onClick={() => setSelectedMovie(movie)}
            type="button"
          >
            <img src={movie.poster} alt={movie.title} className="h-64 w-full object-cover object-top" />
            <div className="p-4">
              <h3 className="font-semibold">{movie.title}</h3>
              <p className="mt-1 text-sm text-slate-400">
                {movie.genres} / {movie.runtime} / Rating {movie.rating}
              </p>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-blue-400/40 bg-blue-950/50 p-4">
        <p>
          Selected movie: <strong className="text-blue-200">{selectedMovie.title}</strong>
        </p>
        <a href="#booking" className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold hover:bg-blue-500">
          Choose seats
        </a>
      </div>
    </section>
  );
}

function ComingSoon({ movies = [] }) {
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

function TrailerCard({ movie }) {
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
        <p>{movie.release || "Coming soon"}</p>
      </div>
    </article>
  );
}

function ShowingNow({ movies = [] }) {
  const displayMovies = movies.length ? movies : advanceSaleMovies;

  return (
    <section className="catalog-section">
      <SectionHeader title="Showing Now" />
      <div className="movie-shelf">
        {displayMovies.map((movie) => (
          <ShelfCard key={movie.title} movie={movie} />
        ))}
      </div>
    </section>
  );
}

function AdvanceSales({ movies = [] }) {
  const apiAdvanceMovies = movies.filter((movie) => movie.status === "advance-sale");
  const displayMovies = apiAdvanceMovies.length >= 4 ? apiAdvanceMovies.slice(0, 4) : advanceSaleMovies;

  return (
    <section className="catalog-section catalog-section-last">
      <SectionHeader title="Advance Ticket Sales" />
      <div className="movie-shelf">
        {displayMovies.map((movie) => (
          <ShelfCard key={movie.title} movie={movie} advance />
        ))}
      </div>
    </section>
  );
}

function SectionHeader({ title }) {
  return (
    <div className="catalog-header">
      <h2>{title}</h2>
      <a href="#movies">See All</a>
    </div>
  );
}

function ShelfCard({ movie, advance = false }) {
  return (
    <article className="shelf-card">
      <img src={movie.poster} alt={movie.title} />
      <h3>{movie.shortTitle || movie.title}</h3>
      <p className="movie-meta">
        <span>{advance ? "From Rp35.000" : movie.year}</span>
        <span className={advance ? "advance-badge" : "meta-rating"}>{advance ? "Advance" : `Rating ${movie.rating}`}</span>
      </p>
    </article>
  );
}

function AppPromo() {
  return (
    <section className="app-promo" aria-labelledby="app-promo-title">
      <div className="app-promo-inner">
        <div className="app-promo-visual" aria-hidden="true">
          <div className="app-brand-tile">
            <img src={asset("beatrix-logo.png")} alt="" />
          </div>
          <img className="app-phone" src={asset("mobile-app.png")} alt="" />
        </div>
        <div className="app-promo-copy">
          <p className="app-promo-kicker">BEATRIX MOVIE APP</p>
          <h2 id="app-promo-title">Book While You Commute</h2>
          <p>Less hassle, easier booking, and more exclusive promos.</p>
          <div className="store-links">
            <a className="store-badge app-store" href="#footer" aria-label="Download on the App Store" />
            <a className="store-badge google-play" href="#footer" aria-label="Get it on Google Play" />
          </div>
        </div>
      </div>
    </section>
  );
}
