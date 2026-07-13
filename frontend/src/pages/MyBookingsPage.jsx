import { useEffect, useState } from "react";
import { Header } from "../components/layout/Header.jsx";
import { cancelBooking, getMyBookings } from "../features/bookings/api/myBookingsApi.js";

export function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  async function loadBookings() {
    try {
      setError("");
      setBookings(await getMyBookings());
    } catch (requestError) {
      setError(requestError.message || "Unable to load your bookings.");
    }
  }

  useEffect(() => { loadBookings(); }, []);

  async function handleCancel(id) {
    if (!window.confirm("Cancel this booking and release its seats?")) return;
    try {
      await cancelBooking(id);
      await loadBookings();
    } catch (requestError) {
      setError(requestError.message || "Unable to cancel this booking.");
    }
  }

  return (
    <div className="min-h-screen bg-[#020b1b] text-white">
      <Header booking />
      <main className="mx-auto max-w-5xl px-6 pb-16 pt-8">
        <h1 className="text-3xl font-semibold">My Bookings</h1>
        {error && <p className="mt-4 rounded-lg border border-red-400/40 p-4 text-red-200">{error}</p>}
        {!error && !bookings.length && <p className="mt-8 text-slate-400">You have no bookings yet.</p>}
        <div className="mt-8 grid gap-4">
          {bookings.map((booking) => (
            <article key={booking._id} className="rounded-xl border border-slate-700 bg-slate-900/70 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{booking.movieTitle}</h2>
                  <p className="mt-2 text-sm text-slate-300">Seats: {booking.seats.join(", ")}</p>
                  <p className="text-sm text-slate-400">{new Date(booking.showtime).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Rp{Number(booking.totalPrice).toLocaleString("id-ID")}</p>
                  <p className="text-sm capitalize text-slate-400">{booking.status === "cancelled" ? "Cancelled" : booking.paymentStatus}</p>
                  {booking.status !== "cancelled" && (
                    <button className="mt-3 rounded-lg border border-red-400/50 px-3 py-2 text-sm text-red-200" onClick={() => handleCancel(booking._id)}>
                      Cancel booking
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
