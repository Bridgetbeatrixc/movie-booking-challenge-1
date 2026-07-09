import { useEffect, useState } from "react";
import { SeatSelectionPage } from "./components/booking/SeatSelectionPage.jsx";
import { asset, comingSoon, defaultMovie, movies } from "./data/movies.js";

export default function App() {
  const [page, setPage] = useState(() => (window.location.hash === "#booking" ? "booking" : "home"));
  const [selectedMovie, setSelectedMovie] = useState(() => {
    const saved = localStorage.getItem("selectedMovie");
    return movies.find((movie) => movie.key === saved || movie.title === saved) || defaultMovie;
  });

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash;
      setPage(hash === "#booking" ? "booking" : "home");

      if (hash === "#booking" || hash === "#" || hash === "") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  function chooseMovie(movie) {
    setSelectedMovie(movie);
    localStorage.setItem("selectedMovie", movie.key);
  }

  return page === "booking" ? (
    <SeatSelectionPage selectedMovie={selectedMovie} setSelectedMovie={chooseMovie} />
  ) : (
    <HomePage selectedMovie={selectedMovie} setSelectedMovie={chooseMovie} />
  );
}

function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
      <a href="#">
        <img src={asset("beatrix-logo.png")} alt="Beatrix Movie" className="h-9" />
      </a>
      <nav className="hidden gap-7 text-sm text-slate-300 md:flex">
        <a className="text-white" href="#">
          Home
        </a>
        <a href="#movies">Movies</a>
        <a href="#coming-soon">Coming soon</a>
        <a href="#footer">Contact</a>
      </nav>
      <a href="#movies" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900">
        Book now
      </a>
    </header>
  );
}

function HomePage({ selectedMovie, setSelectedMovie }) {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Promos />
        <FeaturedMovies selectedMovie={selectedMovie} setSelectedMovie={setSelectedMovie} />
        <ComingSoon />
        <ShowingNow />
        <AdvanceSales />
      </main>
      <AppPromo />
      <Footer />
    </>
  );
}

function Hero() {
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
        <a className="hero-shortcut" href="#movies">
          <img src={asset("cinema-icon.png")} alt="" aria-hidden="true" />
          <span>Bioskop</span>
        </a>
        <a className="hero-shortcut" href="#movies">
          <img src={asset("movie-icon.svg")} alt="" aria-hidden="true" />
          <span>Film</span>
        </a>
        <a className="hero-shortcut" href="#snacks">
          <img src={asset("snack-icon.svg")} alt="" aria-hidden="true" />
          <span>Snacks</span>
        </a>
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

function FeaturedMovies({ selectedMovie, setSelectedMovie }) {
  return (
    <section id="movies" className="mx-auto max-w-7xl px-6 pb-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-300">FEATURED MOVIE</p>
          <h2 className="mt-1 text-3xl font-semibold">Choose your movie</h2>
        </div>
        <span className="text-sm text-slate-400">Pick one to book seats</span>
      </div>
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

function ComingSoon() {
  return (
    <section id="coming-soon" className="catalog-section">
      <SectionHeader title="Coming Soon" />
      <div className="trailer-grid">
        {comingSoon.map((movie) => (
          <article className="trailer-card" key={movie.title}>
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
        ))}
      </div>
    </section>
  );
}

function ShowingNow() {
  return (
    <section className="catalog-section">
      <SectionHeader title="Showing Now" />
      <div className="movie-shelf">
        {movies.map((movie) => (
          <ShelfCard key={movie.title} movie={movie} />
        ))}
      </div>
    </section>
  );
}

function AdvanceSales() {
  const advanceMovies = [comingSoon[0], movies[0], movies[1], movies[3]];

  return (
    <section className="catalog-section catalog-section-last">
      <SectionHeader title="Advance Ticket Sales" />
      <div className="movie-shelf">
        {advanceMovies.map((movie) => (
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

function SectionHeader({ title }) {
  return (
    <div className="catalog-header">
      <h2>{title}</h2>
      <a href="#movies">See All</a>
    </div>
  );
}

function ShelfCard({ movie }) {
  return (
    <article className="shelf-card">
      <img src={movie.poster} alt={movie.title} />
      <h3>{movie.shortTitle}</h3>
      <p className="movie-meta">
        <span>{movie.year}</span>
        <span className="meta-rating">Rating {movie.rating}</span>
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

function Footer() {
  return (
    <footer id="footer" className="border-t border-slate-800 bg-[#010816] px-6 py-10 text-center">
      <img src={asset("beatrix-logo.png")} alt="Beatrix Movie" className="mx-auto h-9" />
      <p className="mt-5 text-sm text-slate-400">About / FAQ / Contact</p>
      <p className="mt-4 text-xs text-slate-500">Copyright 2026 Beatrix Movie. All rights reserved.</p>
    </footer>
  );
}
