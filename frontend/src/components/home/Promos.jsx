import { asset } from "../../utils/assets";
import { PromoCard } from "./PromoCard";

export function Promos() {
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
