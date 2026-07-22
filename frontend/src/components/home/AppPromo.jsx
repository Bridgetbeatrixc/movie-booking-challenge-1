import { asset } from "../../utils/assets";

export function AppPromo() {
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
