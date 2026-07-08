import { useEffect, useState } from "react";

const asset = (name) => `/assets/${name}`;

const movies = [
  {
    title: "The Twilight Saga: Breaking Dawn – Part 2",
    shortTitle: "Breaking Dawn – Part 2",
    poster: asset("breaking-dawn-part-2.png"),
    genres: "Romance / Fantasy",
    runtime: "1h 55m",
    rating: "7.0",
    year: "2012"
  },
  {
    title: "Another Earth",
    shortTitle: "Another Earth",
    poster: asset("another-earth.png"),
    genres: "Sci-Fi / Drama",
    runtime: "1h 32m",
    rating: "6.9",
    year: "2011"
  },
  {
    title: "Arrival",
    shortTitle: "Arrival",
    poster: asset("arrival.png"),
    genres: "Sci-Fi / Drama",
    runtime: "1h 56m",
    rating: "7.9",
    year: "2016"
  },
  {
    title: "Annabelle",
    shortTitle: "Annabelle",
    poster: asset("annabelle.png"),
    genres: "Horror",
    runtime: "1h 39m",
    rating: "5.4",
    year: "2014"
  }
];

const comingSoon = [
  {
    title: "The Nun",
    poster: asset("the-nun.png"),
    release: "Releases September 7, 2026"
  },
  {
    title: "Annabelle",
    poster: asset("annabelle.png"),
    release: "Releases October 3, 2026"
  },
  {
    title: "Breaking Dawn – Part 2",
    poster: asset("breaking-dawn-part-2.png"),
    release: "Releases November 16, 2026"
  }
];

const defaultMovie = movies[0];
const ticketPrice = 35000;
const rows = ["A", "B", "C", "D", "E", "F"];
const occupiedSeats = ["A4", "B2", "C7", "D3", "E8"];

export default function App() {
  const [page, setPage] = useState(() => (window.location.hash === "#booking" ? "booking" : "home"));
  const [selectedMovie, setSelectedMovie] = useState(() => {
    const saved = localStorage.getItem("selectedMovie");
    return movies.find((movie) => movie.title === saved) || defaultMovie;
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
    localStorage.setItem("selectedMovie", movie.title);
  }

  return page === "booking" ? (
    <BookingPage selectedMovie={selectedMovie} setSelectedMovie={chooseMovie} />
  ) : (
    <HomePage selectedMovie={selectedMovie} setSelectedMovie={chooseMovie} />
  );
}

function Header({ booking = false }) {
  return (
    <header
      className={
        booking
          ? "mx-auto flex max-w-6xl items-center justify-between px-6 py-5"
          : "absolute inset-x-0 top-0 z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6"
      }
    >
      <a href="#">
        <img src={asset("beatrix-logo.png")} alt="Beatrix Movie" className="h-9" />
      </a>
      {booking ? (
        <a href="#" className="text-sm text-slate-300 hover:text-white">
          ← Back to movies
        </a>
      ) : (
        <>
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
        </>
      )}
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
        id="snacks"
        title="Snack Time"
        text={
          <>
            Buy 1 BIG Popcorn
            <br />
            Free Chicken + Kentang
          </>
        }
        image={asset("snack-combo.png")}
        imageClass="absolute bottom-0 right-0 h-32"
        cardClass="from-cyan-950 to-sky-900"
      />
      <PromoCard
        title="Movie Premiere"
        text="Your next big story begins here."
        image={asset("the-nun.png")}
        imageClass="absolute bottom-0 right-5 h-32"
        cardClass="from-violet-950 to-violet-700"
      />
      <PromoCard
        title="Feel It In IMAX"
        text="Bigger screen. Bigger sound."
        image={asset("imax-theater.png")}
        imageClass="absolute bottom-0 right-0 h-36 w-32 object-cover"
        cardClass="from-blue-900 to-slate-950"
      />
    </section>
  );
}

function PromoCard({ id, title, text, image, imageClass, cardClass }) {
  return (
    <article
      id={id}
      className={`relative min-h-36 overflow-hidden rounded-xl border border-cyan-300/20 bg-gradient-to-r p-5 ${cardClass}`}
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-slate-300">{text}</p>
      <img src={image} alt="" className={imageClass} />
      <button className="mt-8 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-900">
        Learn more
      </button>
    </article>
  );
}

function FeaturedMovies({ selectedMovie, setSelectedMovie }) {
  return (
    <section id="movies" className="mx-auto max-w-7xl px-6 pb-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-300">FEATURED MOVIE</p>
          <h2 className="mt-1 text-3xl font-semibold">Choose your movie</h2>
        </div>
        <span className="text-sm text-slate-400">Pick one to book seats</span>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {movies.map((movie) => (
          <button
            key={movie.title}
            onClick={() => setSelectedMovie(movie)}
            className={`movie-card overflow-hidden rounded-xl border bg-navy text-left ${
              selectedMovie.title === movie.title ? "selected border-blue-400" : "border-slate-700"
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
      <a href="#movies">
        See All <span aria-hidden="true">→</span>
      </a>
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
        <span className="meta-rating">★ {movie.rating}</span>
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

function BookingPage({ selectedMovie, setSelectedMovie }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const total = selectedSeats.length * ticketPrice;

  function toggleSeat(seatName) {
    setSelectedSeats((current) =>
      current.includes(seatName) ? current.filter((seat) => seat !== seatName) : [...current, seatName]
    );
  }

  function resetBooking() {
    setSelectedSeats([]);
    setSelectedMovie(defaultMovie);
    localStorage.removeItem("selectedMovie");
  }

  return (
    <div className="booking-page min-h-screen text-slate-100">
      <Header booking />
      <main className="mx-auto max-w-6xl px-6 pb-16">
        <BookingHero movie={selectedMovie} />
        <BookingOptions />
        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          <SeatPicker selectedSeats={selectedSeats} toggleSeat={toggleSeat} />
          <BookingSummary movie={selectedMovie} selectedSeats={selectedSeats} total={total} resetBooking={resetBooking} />
        </section>
      </main>
      <footer className="border-t border-slate-800 py-7 text-center text-xs text-slate-500">
        © 2026 Beatrix Movie · React booking demo
      </footer>
    </div>
  );
}

function BookingHero({ movie }) {
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

function BookingOptions() {
  return (
    <section className="mt-6 grid gap-4 md:grid-cols-3">
      <div className="rounded-xl border border-slate-700 bg-[#06152d] p-5">
        <p className="text-sm text-slate-400">Select date</p>
        <div className="mt-3 flex gap-2">
          {["Sat 21", "Sun 22", "Mon 23"].map((date, index) => {
            const [day, number] = date.split(" ");
            return (
              <button
                key={date}
                className={`rounded-lg border px-3 py-2 text-sm ${
                  index === 0 ? "border-blue-400 bg-blue-600" : "border-slate-700"
                }`}
              >
                {day}
                <br />
                <b>{number}</b>
              </button>
            );
          })}
        </div>
      </div>
      <div className="rounded-xl border border-slate-700 bg-[#06152d] p-5">
        <p className="text-sm text-slate-400">Select cinema</p>
        <select className="mt-3 w-full rounded-lg border border-slate-600 bg-[#0a2140] p-3 text-sm">
          <option>Beatrix Movieplex - Central World</option>
          <option>Beatrix Cinema - Grand Mall</option>
        </select>
      </div>
      <div className="rounded-xl border border-slate-700 bg-[#06152d] p-5">
        <p className="text-sm text-slate-400">Select showtime</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="rounded-lg border border-slate-600 px-3 py-2 text-sm">10:30</button>
          <button className="rounded-lg border border-blue-400 bg-blue-600 px-3 py-2 text-sm">1:30 PM</button>
          <button className="rounded-lg border border-slate-600 px-3 py-2 text-sm">7:40 PM</button>
        </div>
      </div>
    </section>
  );
}

function SeatPicker({ selectedSeats, toggleSeat }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-[#06152d] p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Select your seats</h2>
          <p className="mt-1 text-sm text-slate-400">Rp35.000 per seat</p>
        </div>
        <div className="flex gap-3 text-xs text-slate-400">
          <span>
            <i className="mr-1 inline-block h-3 w-3 rounded bg-slate-600" />
            Available
          </span>
          <span>
            <i className="mr-1 inline-block h-3 w-3 rounded bg-blue-500" />
            Selected
          </span>
          <span>
            <i className="mr-1 inline-block h-3 w-3 rounded bg-slate-700" />
            Occupied
          </span>
        </div>
      </div>
      <div className="mx-auto mt-9 max-w-xl">
        <div className="rounded-[50%] border-t-4 border-blue-300/80 pt-3 text-center text-xs font-semibold tracking-[.45em] text-blue-100">
          SCREEN
        </div>
        <div className="mt-8 space-y-3">
          {rows.map((row) => (
            <div className="flex items-center gap-2" key={row}>
              <span className="w-4 text-center text-sm text-slate-400">{row}</span>
              {Array.from({ length: 8 }, (_, index) => {
                const seatName = `${row}${index + 1}`;
                const occupied = occupiedSeats.includes(seatName);
                const selected = selectedSeats.includes(seatName);
                return (
                  <button
                    key={seatName}
                    disabled={occupied}
                    onClick={() => toggleSeat(seatName)}
                    className={`seat h-8 flex-1 rounded border border-slate-600 bg-slate-700 text-xs transition hover:border-blue-300 hover:bg-slate-600 ${
                      occupied ? "occupied" : ""
                    } ${selected ? "selected" : ""}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BookingSummary({ movie, selectedSeats, total, resetBooking }) {
  const selectedSeatsText = selectedSeats.length ? selectedSeats.join(", ") : "No seats selected";

  return (
    <aside className="h-fit rounded-2xl border border-blue-400/30 bg-[#071b36] p-6 shadow-xl lg:sticky lg:top-5">
      <p className="text-sm font-semibold tracking-[.2em] text-blue-300">BOOKING SUMMARY</p>
      <div className="mt-5 flex gap-4">
        <img src={movie.poster} alt={`${movie.title} poster`} className="h-24 w-16 rounded object-cover" />
        <div>
          <h2 className="text-xl font-semibold">{movie.title}</h2>
          <span className="mt-2 inline-block rounded border border-blue-400 px-2 py-1 text-xs text-blue-200">IMAX</span>
        </div>
      </div>
      <div className="my-5 h-px bg-slate-700" />
      <p className="text-sm text-slate-400">Sat, 21 Jun 2026 · 1:30 PM</p>
      <p className="mt-2 text-sm text-slate-400">Beatrix Movieplex · Hall IMAX</p>
      <div className="my-5 h-px bg-slate-700" />
      <p className="text-sm font-semibold">Selected seats</p>
      <p className="mt-2 min-h-6 text-sm text-blue-200">{selectedSeatsText}</p>
      <div className="my-5 h-px bg-slate-700" />
      <div className="flex justify-between text-sm text-slate-400">
        <span>Ticket price</span>
        <span>Rp35.000 × {selectedSeats.length}</span>
      </div>
      <div className="mt-4 flex justify-between text-xl font-semibold">
        <span>Total</span>
        <span className="text-blue-300">Rp{total.toLocaleString("id-ID")}</span>
      </div>
      <button className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold transition hover:bg-blue-500">
        Continue to Payment →
      </button>
      <button
        onClick={resetBooking}
        className="mt-3 w-full rounded-lg border border-slate-600 py-3 text-sm text-slate-300 hover:bg-slate-800"
      >
        Reset booking
      </button>
    </aside>
  );
}

function Footer() {
  return (
    <footer id="footer" className="border-t border-slate-800 bg-[#010816] px-6 py-10 text-center">
      <img src={asset("beatrix-logo.png")} alt="Beatrix Movie" className="mx-auto h-9" />
      <p className="mt-5 text-sm text-slate-400">About · FAQ · Contact</p>
      <p className="mt-4 text-xs text-slate-500">© 2026 Beatrix Movie. All rights reserved.</p>
    </footer>
  );
}
