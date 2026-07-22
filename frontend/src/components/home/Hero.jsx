import { asset } from "../../utils/assets";

const shortcuts = [
  { label: "Bioskop", href: "#movies", icon: "cinema-icon.png" },
  { label: "Film", href: "#movies", icon: "movie-icon.svg" },
  { label: "Snacks", href: "#snacks", icon: "snack-icon.svg" }
];

export function Hero() {
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
