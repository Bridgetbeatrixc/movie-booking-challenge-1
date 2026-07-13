import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/layout/Header.jsx";
import { asset } from "../features/movies/data/movies.js";
import { useAuth } from "../features/auth/AuthContext.jsx";
import { BookingSummary } from "../features/showtimes/components/BookingSummary.jsx";
import { SeatGrid } from "../features/showtimes/components/SeatGrid.jsx";
import { ShowtimeList } from "../features/showtimes/components/ShowtimeList.jsx";
import { fetchSeatAvailability, fetchShowtimesForMovie } from "../features/showtimes/api/showtimeApi.js";
import { checkoutBooking } from "../features/bookings/api/bookingApi.js";
import { saveCheckout } from "../features/bookings/storage/checkoutStorage.js";
import { isPastShowtime } from "../utils/formatters.js";

function getAvailableShowtime(showtimes, selectedDate, selectedStudio) {
  return showtimes.find((showtime) => {
    const dateMatches = !selectedDate || showtime.date === selectedDate;
    const studioMatches = !selectedStudio || showtime.studio === selectedStudio;

    return dateMatches && studioMatches && !isPastShowtime(showtime);
  });
}

export function SeatSelectionPage({ selectedMovie, setSelectedMovie }) {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStudio, setSelectedStudio] = useState("");
  const [seatAvailability, setSeatAvailability] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showtimeError, setShowtimeError] = useState("");
  const [seatError, setSeatError] = useState("");
  const [showtimeLoading, setShowtimeLoading] = useState(false);
  const [seatLoading, setSeatLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadShowtimes() {
      setShowtimeLoading(true);
      setShowtimeError("");
      setSelectedShowtime(null);
      setSelectedDate("");
      setSelectedStudio("");
      setSeatAvailability([]);
      setSelectedSeats([]);

      try {
        const nextShowtimes = await fetchShowtimesForMovie(selectedMovie);
        const firstAvailable = nextShowtimes.find((showtime) => !isPastShowtime(showtime));

        if (!cancelled) {
          setShowtimes(nextShowtimes);
          setSelectedDate(firstAvailable?.date || nextShowtimes[0]?.date || "");
          setSelectedStudio("");
          setSelectedShowtime(firstAvailable || null);
        }
      } catch (error) {
        if (!cancelled) {
          setShowtimeError(error.message || "Showtime data failed to load.");
          setShowtimes([]);
        }
      } finally {
        if (!cancelled) {
          setShowtimeLoading(false);
        }
      }
    }

    loadShowtimes();

    return () => {
      cancelled = true;
    };
  }, [selectedMovie]);

  useEffect(() => {
    if (!showtimes.length) {
      return;
    }

    const studioStillExists = showtimes.some(
      (showtime) => (!selectedDate || showtime.date === selectedDate) && showtime.studio === selectedStudio
    );

    if (selectedStudio && !studioStillExists) {
      setSelectedStudio("");
      return;
    }

    const currentShowtimeStillMatches =
      selectedShowtime &&
      (!selectedDate || selectedShowtime.date === selectedDate) &&
      (!selectedStudio || selectedShowtime.studio === selectedStudio) &&
      !isPastShowtime(selectedShowtime);

    if (!currentShowtimeStillMatches) {
      setSelectedShowtime(getAvailableShowtime(showtimes, selectedDate, selectedStudio) || null);
    }
  }, [selectedDate, selectedStudio, selectedShowtime, showtimes]);

  useEffect(() => {
    let cancelled = false;

    async function loadSeats() {
      if (!selectedShowtime) {
        setSeatAvailability([]);
        return;
      }

      setSeatLoading(true);
      setSeatError("");
      setSelectedSeats([]);

      try {
        const seatData = await fetchSeatAvailability(selectedShowtime);

        if (!cancelled) {
          setSeatAvailability(seatData.availability || []);
        }
      } catch (error) {
        if (!cancelled) {
          setSeatError(error.message || "Seat data failed to load.");
          setSeatAvailability([]);
        }
      } finally {
        if (!cancelled) {
          setSeatLoading(false);
        }
      }
    }

    loadSeats();

    return () => {
      cancelled = true;
    };
  }, [selectedShowtime]);

  function toggleSeat(seatId) {
    setSelectedSeats((currentSeats) =>
      currentSeats.includes(seatId) ? currentSeats.filter((seat) => seat !== seatId) : [...currentSeats, seatId]
    );
  }

  function resetBooking() {
    setSelectedSeats([]);
    setCheckoutError("");
    setSeatError("");
    setSelectedShowtime(getAvailableShowtime(showtimes, selectedDate, selectedStudio) || null);
  }

  function refreshShowtimes() {
    setSelectedMovie({ ...selectedMovie });
  }

  function refreshSeats() {
    setSelectedShowtime((currentShowtime) => (currentShowtime ? { ...currentShowtime } : currentShowtime));
  }

  async function continueBooking() {
    if (!selectedShowtime || selectedSeats.length === 0) {
      return;
    }

    if (!authLoading && !isAuthenticated) {
      setCheckoutError("Please login before continuing to payment.");
      navigate("/login");
      return;
    }

    setIsCheckingOut(true);
    setCheckoutError("");

    try {
      const result = await checkoutBooking({
        showtimeId: selectedShowtime.id,
        movieId: selectedMovie._id || selectedMovie.id,
        movieTitle: selectedMovie.title,
        moviePoster: selectedMovie.poster,
        cinema: `Beatrix Movieplex - ${selectedShowtime.studio}`,
        showtime: `${selectedShowtime.date}T${selectedShowtime.time}:00`,
        seats: selectedSeats
      });

      saveCheckout(result);
      window.location.hash = "payment";
    } catch (error) {
      setCheckoutError(error.message || "Unable to create the QRIS payment.");
      if (error.unavailableSeats?.length) {
        setSelectedSeats((current) => current.filter((seat) => !error.unavailableSeats.includes(seat)));
        refreshSeats();
      }
    } finally {
      setIsCheckingOut(false);
    }
  }

  return (
    <div className="booking-page min-h-screen text-slate-100">
      <Header booking />
      <main className="mx-auto max-w-6xl px-6 pb-16">
        <BookingHero movie={selectedMovie} />
        <div className="mt-6">
          <ShowtimeList
            error={showtimeError}
            loading={showtimeLoading}
            onRetry={refreshShowtimes}
            onSelect={setSelectedShowtime}
            onSelectDate={setSelectedDate}
            onSelectStudio={setSelectedStudio}
            selectedDate={selectedDate}
            selectedShowtimeId={selectedShowtime?.id}
            selectedStudio={selectedStudio}
            showtimes={showtimes}
          />
        </div>
        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          <SeatGrid
            availability={seatAvailability}
            error={seatError}
            loading={seatLoading}
            onRetry={refreshSeats}
            onToggleSeat={toggleSeat}
            selectedSeats={selectedSeats}
            showtime={selectedShowtime}
          />
          <BookingSummary
            movie={selectedMovie}
            checkoutError={checkoutError}
            isCheckingOut={isCheckingOut}
            onContinue={continueBooking}
            onReset={resetBooking}
            selectedSeats={selectedSeats}
            showtime={selectedShowtime}
          />
        </section>
      </main>
      <footer className="border-t border-slate-800 py-7 text-center text-xs text-slate-500">
        Copyright 2026 Beatrix Movie - React booking demo
      </footer>
    </div>
  );
}

function BookingHero({ movie }) {
  return (
    <section className="relative overflow-hidden rounded-xl border border-blue-300/20 bg-[#06152d] p-6 shadow-2xl md:p-9">
      <div className="absolute inset-0 bg-[url('/assets/cinema-hero-v2.png')] bg-cover bg-center opacity-20" />
      <div className="relative grid items-center gap-6 md:grid-cols-[150px_1fr]">
        <img src={movie.poster} alt={`${movie.title} poster`} className="h-48 w-36 rounded-lg object-cover shadow-xl" />
        <div>
          <p className="text-sm font-semibold tracking-[.25em] text-blue-300">NOW BOOKING</p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight">{movie.title}</h1>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
            <span className="rounded bg-slate-800 px-3 py-1">{movie.genres}</span>
            <span className="rounded bg-slate-800 px-3 py-1">{movie.runtime}</span>
            <span className="rounded bg-slate-800 px-3 py-1">Rating {movie.rating}/10</span>
          </div>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
            Fresh seat availability for every session, from regular studios to the IMAX hall.
          </p>
        </div>
      </div>
    </section>
  );
}
