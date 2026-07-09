export function PromoCard({ id, title, text, image, imageClass, cardClass }) {
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
