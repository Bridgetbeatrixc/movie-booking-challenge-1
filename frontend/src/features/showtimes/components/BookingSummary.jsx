import { ticketPrice } from "../data/bookingOptions.js";
import { formatRupiah } from "../../../shared/utils/currency.js";
import { formatCurrency, formatShowDate, formatShowTime } from "../../../shared/utils/formatters.js";

export function BookingSummary(props) {
  if ("showtime" in props || "onContinue" in props) {
    return <ShowtimeBookingSummary {...props} />;
  }

  return <CheckoutBookingSummary {...props} />;
}

function CheckoutBookingSummary({
  checkout,
  checkoutError,
  isCheckingOut,
  movie,
  onCheckout,
  onMockPaid,
  resetBooking,
  selectedSeats,
  total
}) {
  const selectedSeatsText = selectedSeats.length ? selectedSeats.join(", ") : "No seats selected";
  const canCheckout = selectedSeats.length > 0 && !isCheckingOut;

  return (
    <aside className="h-fit rounded-2xl border border-blue-400/30 bg-[#071b36] p-6 shadow-xl lg:sticky lg:top-5">
      <p className="text-sm font-semibold tracking-[.2em] text-blue-300">BOOKING SUMMARY</p>
      <MovieSummary movie={movie} studio="IMAX" />
      <Divider />
      <p className="text-sm text-slate-400">Sat, 21 Jun 2026 - 1:30 PM</p>
      <p className="mt-2 text-sm text-slate-400">Beatrix Movieplex - Hall IMAX</p>
      <Divider />
      <p className="text-sm font-semibold">Selected seats</p>
      <p className="mt-2 min-h-6 text-sm text-blue-200">{selectedSeatsText}</p>
      <Divider />
      <div className="flex justify-between text-sm text-slate-400">
        <span>Ticket price</span>
        <span>
          {formatRupiah(ticketPrice)} x {selectedSeats.length}
        </span>
      </div>
      <div className="mt-4 flex justify-between text-xl font-semibold">
        <span>Total</span>
        <span className="text-blue-300">{formatRupiah(total)}</span>
      </div>

      {checkoutError ? (
        <p className="mt-5 rounded-lg border border-red-400/30 bg-red-950/40 p-3 text-sm text-red-100">{checkoutError}</p>
      ) : null}
      {checkout ? <PaymentMockCard checkout={checkout} onMockPaid={onMockPaid} /> : null}

      <button
        disabled={!canCheckout}
        onClick={onCheckout}
        className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        type="button"
      >
        {isCheckingOut ? "Creating QRIS payment..." : "Continue to QRIS Payment"}
      </button>
      <button
        onClick={resetBooking}
        className="mt-3 w-full rounded-lg border border-slate-600 py-3 text-sm text-slate-300 hover:bg-slate-800"
        type="button"
      >
        Reset booking
      </button>
    </aside>
  );
}

function ShowtimeBookingSummary({ movie, onContinue, onReset, selectedSeats, showtime }) {
  const selectedSeatsText = selectedSeats.length ? selectedSeats.join(", ") : "No seats selected";
  const total = selectedSeats.length * (showtime?.price || 0);

  return (
    <aside className="h-fit rounded-xl border border-blue-400/30 bg-[#071b36] p-6 shadow-xl lg:sticky lg:top-5">
      <p className="text-sm font-semibold tracking-[.2em] text-blue-300">BOOKING SUMMARY</p>
      <MovieSummary movie={movie} studio={showtime?.studio || "No studio"} />
      <Divider />

      <p className="text-sm text-slate-400">
        {showtime ? `${formatShowDate(showtime.date)} - ${formatShowTime(showtime.time)}` : "No showtime selected"}
      </p>
      <p className="mt-2 text-sm text-slate-400">{showtime?.studio || "Select a schedule"}</p>

      <Divider />
      <p className="text-sm font-semibold">Selected seats</p>
      <p className="mt-2 min-h-6 text-sm text-blue-200">{selectedSeatsText}</p>
      <Divider />

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

function PaymentMockCard({ checkout, onMockPaid }) {
  const payment = checkout.payment;
  const paid = checkout.booking?.paymentStatus === "paid" || payment?.status === "PAID";

  return (
    <div className="mt-5 rounded-xl border border-blue-400/30 bg-blue-950/30 p-4 text-sm">
      <p className="font-semibold text-blue-100">Xendit QRIS Mock Payment</p>
      <p className="mt-2 text-slate-300">Invoice: {payment?.invoiceId}</p>
      <p className="text-slate-300">Amount: {formatRupiah(payment?.amount || 0)}</p>
      <p className={paid ? "mt-2 font-semibold text-emerald-300" : "mt-2 font-semibold text-amber-300"}>
        Status: {paid ? "PAID" : "PENDING"}
      </p>
      <a className="mt-3 inline-block text-blue-200 underline" href={payment?.invoiceUrl}>
        Open QRIS payment page
      </a>
      {!paid ? (
        <button
          onClick={onMockPaid}
          className="mt-3 w-full rounded-lg border border-emerald-400/60 px-3 py-2 text-emerald-100 hover:bg-emerald-500/10"
          type="button"
        >
          Simulate successful payment
        </button>
      ) : null}
    </div>
  );
}

function MovieSummary({ movie, studio }) {
  return (
    <div className="mt-5 flex gap-4">
      <img src={movie.poster} alt={`${movie.title} poster`} className="h-24 w-16 rounded object-cover" />
      <div>
        <h2 className="text-xl font-semibold leading-tight">{movie.title}</h2>
        <span className="mt-2 inline-block rounded border border-blue-400 px-2 py-1 text-xs text-blue-200">{studio}</span>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="my-5 h-px bg-slate-700" />;
}
