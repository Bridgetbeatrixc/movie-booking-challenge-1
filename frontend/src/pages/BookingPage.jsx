import { useEffect, useState } from "react";
import { BookingHero } from "../components/booking/BookingHero";
import { BookingOptions } from "../components/booking/BookingOptions";
import { BookingSummary } from "../components/booking/BookingSummary";
import { SeatPicker } from "../components/booking/SeatPicker";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { ticketPrice } from "../constants/booking";
import { defaultMovie } from "../data/movies";
import { saveCheckout } from "../services/checkoutStorage";
import { checkoutBooking, getOccupiedSeats, markBookingPaid } from "../services/api";

const defaultCinema = "Beatrix Movieplex - Central World";
const defaultShowtime = "2026-06-21T13:30:00.000Z";

export function BookingPage({ selectedMovie, setSelectedMovie }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [checkout, setCheckout] = useState(null);
  const [checkoutError, setCheckoutError] = useState("");
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const total = selectedSeats.length * ticketPrice;

  useEffect(() => {
    let active = true;

    async function loadOccupiedSeats() {
      try {
        const result = await getOccupiedSeats({
          movieId: selectedMovie.id || selectedMovie._id || "",
          cinema: defaultCinema,
          showtime: defaultShowtime
        });

        if (active) {
          setOccupiedSeats(result.occupiedSeats || []);
        }
      } catch {
        if (active) {
          setOccupiedSeats([]);
        }
      }
    }

    loadOccupiedSeats();

    return () => {
      active = false;
    };
  }, [selectedMovie]);

  function toggleSeat(seatName) {
    if (occupiedSeats.includes(seatName)) {
      return;
    }

    setSelectedSeats((current) =>
      current.includes(seatName) ? current.filter((seat) => seat !== seatName) : [...current, seatName]
    );
  }

  function resetBooking() {
    setSelectedSeats([]);
    setCheckout(null);
    setCheckoutError("");
    setSelectedMovie(defaultMovie);
    localStorage.removeItem("selectedMovie");
  }

  async function handleCheckout() {
    setIsCheckingOut(true);
    setCheckoutError("");

    try {
      const result = await checkoutBooking({
        movieId: selectedMovie.id || selectedMovie._id,
        movieTitle: selectedMovie.title,
        moviePoster: selectedMovie.poster,
        cinema: defaultCinema,
        showtime: defaultShowtime,
        seats: selectedSeats
      });

      setCheckout(result);
      setOccupiedSeats((current) => [...new Set([...current, ...selectedSeats])]);
      saveCheckout(result);
      window.location.hash = "payment";
    } catch (error) {
      setCheckoutError(error.message);
    } finally {
      setIsCheckingOut(false);
    }
  }

  async function handleMockPaid() {
    if (!checkout?.booking?._id) {
      return;
    }

    try {
      const paidBooking = await markBookingPaid(checkout.booking._id);
      setCheckout((current) => ({
        ...current,
        booking: paidBooking,
        payment: {
          ...current.payment,
          status: "PAID"
        }
      }));
    } catch (error) {
      setCheckoutError(error.message);
    }
  }

  return (
    <div className="booking-page min-h-screen text-slate-100">
      <Header booking />
      <main className="mx-auto max-w-6xl px-6 pb-16">
        <BookingHero movie={selectedMovie} />
        <BookingOptions />
        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          <SeatPicker occupiedSeats={occupiedSeats} selectedSeats={selectedSeats} toggleSeat={toggleSeat} />
          <BookingSummary
            checkout={checkout}
            checkoutError={checkoutError}
            isCheckingOut={isCheckingOut}
            movie={selectedMovie}
            onCheckout={handleCheckout}
            onMockPaid={handleMockPaid}
            resetBooking={resetBooking}
            selectedSeats={selectedSeats}
            total={total}
          />
        </section>
      </main>
      <Footer compact />
    </div>
  );
}
