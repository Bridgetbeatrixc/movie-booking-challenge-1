import { formatCurrency, formatShowDate, formatShowTime } from "../../../shared/utils/formatters.js";

export function BookingSummary({ movie, onContinue, onReset, selectedSeats, showtime }) {
  const selectedSeatsText = selectedSeats.length ? selectedSeats.join(", ") : "No seats selected";
  const total = selectedSeats.length * (showtime?.price || 0);

  return (
    <aside className="h-fit rounded-xl border border-blue-400/30 bg-[#071b36] p-6 shadow-xl lg:sticky lg:top-5">
      <p className="text-sm font-semibold tracking-[.2em] text-blue-300">BOOKING SUMMARY</p>
      <div className="mt-5 flex gap-4">
        <img src={movie.poster} alt={`${movie.title} poster`} className="h-24 w-16 rounded object-cover" />
        <div>
          <h2 className="text-xl font-semibold leading-tight">{movie.title}</h2>
          <span className="mt-2 inline-block rounded border border-blue-400 px-2 py-1 text-xs text-blue-200">
            {showtime?.studio || "No studio"}
          </span>
        </div>
      </div>

      <div className="my-5 h-px bg-slate-700" />

      <p className="text-sm text-slate-400">
        {showtime ? `${formatShowDate(showtime.date)} - ${formatShowTime(showtime.time)}` : "No showtime selected"}
      </p>
      <p className="mt-2 text-sm text-slate-400">{showtime?.studio || "Select a schedule"}</p>

      <div className="my-5 h-px bg-slate-700" />

      <p className="text-sm font-semibold">Selected seats</p>
      <p className="mt-2 min-h-6 text-sm text-blue-200">{selectedSeatsText}</p>

      <div className="my-5 h-px bg-slate-700" />

      <div className="flex justify-between gap-4 text-sm text-slate-400">
        <span>Ticket price</span>
        <span>
          {formatCurrency(showtime?.price || 0)} x {selectedSeats.length}
        </span>
      </div>
      <div className="mt-4 flex justify-between gap-4 text-xl font-semibold">
        <span>Total</span>
        <span className="text-blue-300">{formatCurrency(total)}</span>
      </div>

      <button
        className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        disabled={!showtime || selectedSeats.length === 0}
        onClick={onContinue}
        type="button"
      >
        Continue to Booking
      </button>
      <button
        className="mt-3 w-full rounded-lg border border-slate-600 py-3 text-sm text-slate-300 hover:bg-slate-800"
        onClick={onReset}
        type="button"
      >
        Reset booking
      </button>
    </aside>
  );
}
