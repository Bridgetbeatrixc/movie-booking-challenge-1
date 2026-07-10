import { useEffect, useMemo, useState } from "react";
import { Footer } from "../components/layout/Footer.jsx";
import { Header } from "../components/layout/Header.jsx";
import { getTicketPdfUrl, markBookingPaid, sendTicketEmail as sendTicketEmailRequest } from "../features/bookings/api/bookingApi.js";
import { loadCheckout, saveCheckout } from "../features/bookings/storage/checkoutStorage.js";
import { asset } from "../utils/assets.js";
import { formatRupiah } from "../utils/currency.js";

export function PaymentPage() {
  const [checkout, setCheckout] = useState(loadCheckout);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("guest@example.com");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailPreviewUrl, setEmailPreviewUrl] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const qrisCells = useMemo(() => buildMockQrCells(checkout?.payment?.qrString || ""), [checkout]);

  useEffect(() => {
    if (!checkout) {
      setError("No payment session found. Please create a booking first.");
    }
  }, [checkout]);

  async function simulatePaymentSuccess() {
    if (!checkout?.booking?._id) return;

    setIsPaying(true);
    setError("");

    try {
      const paidBooking = await markBookingPaid(checkout.booking._id);
      const nextCheckout = {
        ...checkout,
        booking: paidBooking,
        payment: {
          ...checkout.payment,
          status: "PAID"
        }
      };

      setCheckout(nextCheckout);
      saveCheckout(nextCheckout);
      setShowTicket(true);
    } catch (paymentError) {
      setError(paymentError.message);
    } finally {
      setIsPaying(false);
    }
  }

  async function sendTicketEmail() {
    if (!checkout?.booking?._id) return;

    setIsSendingEmail(true);
    setEmailMessage("");
    setEmailPreviewUrl("");
    setError("");

    try {
      const result = await sendTicketEmailRequest(checkout.booking._id, email);
      const nextCheckout = {
        ...checkout,
        booking: result.booking
      };

      setCheckout(nextCheckout);
      saveCheckout(nextCheckout);
      setEmailMessage(result.message);
      setEmailPreviewUrl(result.previewUrl || "");
    } catch (emailError) {
      setError(emailError.message);
    } finally {
      setIsSendingEmail(false);
    }
  }

  const paid = checkout?.booking?.paymentStatus === "paid" || checkout?.payment?.status === "PAID";

  return (
    <div className="payment-page min-h-screen text-slate-100">
      <Header booking />
      <main className="mx-auto grid max-w-6xl gap-6 px-6 pb-16 pt-4 lg:grid-cols-[1fr_380px]">
        <section className="payment-hero rounded-3xl border border-blue-300/20 bg-[#06152d] p-7 shadow-2xl md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <img src={asset("beatrix-logo.png")} alt="Beatrix Movie" className="h-12" />
            <span className="rounded-full border border-cyan-300/40 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100">
              Xendit QRIS Sandbox
            </span>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-[320px_1fr] md:items-center">
            <div className="qris-panel">
              <div className="qris-frame" aria-label="Mock QRIS code">
                {qrisCells.map((active, index) => (
                  <span className={active ? "is-active" : ""} key={index} />
                ))}
                <div className="qris-logo">BM</div>
              </div>
              <p className="mt-4 text-center text-xs font-semibold tracking-[0.28em] text-slate-400">SCAN QRIS</p>
            </div>

            <div>
              <p className="text-sm font-semibold tracking-[.25em] text-blue-300">PAYMENT PAGE</p>
              <h1 className="mt-3 text-4xl font-semibold">Complete your QRIS payment</h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
                This is a Xendit-style sandbox QRIS page for Beatrix Movie. No real money moves here — tap the simulate
                button to mark the booking as paid.
              </p>

              {checkout ? (
                <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950/35 p-5">
                  <InfoRow label="Invoice" value={checkout.payment?.invoiceId} />
                  <InfoRow label="Method" value={checkout.payment?.paymentMethod || "QRIS"} />
                  <InfoRow label="Amount" value={formatRupiah(checkout.payment?.amount || checkout.booking?.totalPrice || 0)} />
                  <InfoRow label="Status" value={paid ? "PAID" : "PENDING"} highlight={paid ? "success" : "warning"} />
                </div>
              ) : null}

              {error ? <p className="mt-5 rounded-xl border border-red-400/30 bg-red-950/40 p-4 text-sm text-red-100">{error}</p> : null}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  disabled={!checkout || paid || isPaying}
                  onClick={simulatePaymentSuccess}
                  className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                >
                  {paid ? "Payment successful" : isPaying ? "Processing..." : "Simulate QRIS Payment Success"}
                </button>
                {paid ? (
                  <button
                    onClick={() => setShowTicket(true)}
                    className="rounded-xl border border-emerald-400/60 px-6 py-3 font-semibold text-emerald-100 hover:bg-emerald-500/10"
                  >
                    View ticket
                  </button>
                ) : null}
                <a href="#booking" className="rounded-xl border border-slate-600 px-6 py-3 font-semibold text-slate-200 transition hover:bg-slate-800">
                  Back to booking
                </a>
              </div>
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-3xl border border-blue-400/30 bg-[#071b36] p-6 shadow-xl">
          <p className="text-sm font-semibold tracking-[.2em] text-blue-300">ORDER SUMMARY</p>
          {checkout ? (
            <>
              <div className="mt-5 flex gap-4">
                <img src={checkout.booking?.moviePoster} alt="" className="h-28 w-20 rounded-xl object-cover" />
                <div>
                  <h2 className="text-xl font-semibold">{checkout.booking?.movieTitle}</h2>
                  <p className="mt-2 text-sm text-slate-400">Seats: {checkout.booking?.seats?.join(", ")}</p>
                </div>
              </div>
              <div className="my-5 h-px bg-slate-700" />
              <InfoRow label="Cinema" value={checkout.booking?.cinema} />
              <InfoRow label="Provider" value="Xendit Sandbox Mock" />
              <InfoRow label="Total" value={formatRupiah(checkout.booking?.totalPrice || 0)} />
            </>
          ) : (
            <p className="mt-5 text-sm text-slate-400">Create a booking to see the payment details.</p>
          )}
        </aside>
      </main>

      {paid && showTicket ? (
        <TicketModal
          checkout={checkout}
          email={email}
          emailMessage={emailMessage}
          emailPreviewUrl={emailPreviewUrl}
          isSendingEmail={isSendingEmail}
          onClose={() => setShowTicket(false)}
          onEmailChange={setEmail}
          onSendEmail={sendTicketEmail}
        />
      ) : null}

      <Footer compact />
    </div>
  );
}

function TicketModal({ checkout, email, emailMessage, emailPreviewUrl, isSendingEmail, onClose, onEmailChange, onSendEmail }) {
  const booking = checkout.booking;
  const ticket = booking.ticket || {};

  return (
    <div className="ticket-modal-backdrop" role="dialog" aria-modal="true" aria-label="Your movie ticket">
      <div className="ticket-modal">
        <button className="ticket-close" onClick={onClose} aria-label="Close ticket">
          ×
        </button>

        <div className="ticket-mobile-card">
          <div className="ticket-top">
            <p>Order code</p>
            <strong>{ticket.ticketCode}</strong>
            <img src={ticket.qrImageDataUrl} alt="Ticket QR code" className="ticket-main-qr" />
            <span>Scan to redeem</span>
          </div>

          <div className="ticket-perforation" />

          <div className="ticket-details">
            <img src={booking.moviePoster} alt="" className="ticket-poster" />
            <div>
              <h2>{booking.movieTitle}</h2>
              <p>🎬 Beatrix Movie</p>
              <p>📍 {booking.cinema}</p>
              <p>📅 {new Date(booking.showtime).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</p>
              <p>💺 {booking.seats?.join(", ")}</p>
            </div>
          </div>

          <div className="ticket-total">
            <span>Total payment</span>
            <strong>{formatRupiah(booking.totalPrice || 0)}</strong>
          </div>
        </div>

        <div className="ticket-actions-card">
          <p className="ticket-kicker">YOUR TICKET</p>
          <h3>{booking.movieTitle}</h3>
          <p>Ticket Code: {ticket.ticketCode}</p>
          <p>Seats: {booking.seats?.join(", ")}</p>

          <div className="ticket-action-row">
            <input onChange={(event) => onEmailChange(event.target.value)} placeholder="guest@example.com" value={email} />
            <button disabled={isSendingEmail} onClick={onSendEmail}>
              {isSendingEmail ? "Sending..." : "Send email"}
            </button>
            <a href={getTicketPdfUrl(booking._id)} target="_blank">
              Download PDF
            </a>
          </div>

          {emailMessage ? <p className="ticket-email-message">{emailMessage}</p> : null}
          {emailPreviewUrl ? (
            <a className="ticket-preview-link" href={emailPreviewUrl} target="_blank">
              Open email preview
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, highlight }) {
  const valueClass =
    highlight === "success" ? "text-emerald-300" : highlight === "warning" ? "text-amber-300" : "text-slate-100";

  return (
    <div className="mt-3 flex items-center justify-between gap-4 text-sm">
      <span className="text-slate-400">{label}</span>
      <span className={`text-right font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}

function buildMockQrCells(seed) {
  const source = seed || "BEATRIX-XENDIT-QRIS-MOCK";

  return Array.from({ length: 225 }, (_, index) => {
    const row = Math.floor(index / 15);
    const col = index % 15;
    const inFinder = (row < 5 && col < 5) || (row < 5 && col > 9) || (row > 9 && col < 5);

    if (inFinder) {
      const localRow = row < 5 ? row : row - 10;
      const localCol = col < 5 ? col : col - 10;
      return localRow === 0 || localRow === 4 || localCol === 0 || localCol === 4 || (localRow === 2 && localCol === 2);
    }

    const code = source.charCodeAt(index % source.length);
    return (code + row * 7 + col * 11 + index) % 3 !== 0;
  });
}
