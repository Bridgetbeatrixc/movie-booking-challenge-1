import { asset } from "../../utils/assets";

export function Header({ booking = false }) {
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

      {booking ? <BookingBackLink /> : <HomeNavigation />}
    </header>
  );
}

function BookingBackLink() {
  return (
    <a href="#" className="text-sm text-slate-300 hover:text-white">
      ← Back to movies
    </a>
  );
}

function HomeNavigation() {
  return (
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
  );
}
