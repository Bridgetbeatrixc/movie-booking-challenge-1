import React, { useState, useEffect } from 'react';
import { getLocalStorageData, saveToLocalStorage } from './mockData';
import AdminSidebar from './components/AdminSidebar';
import DashboardView from './components/DashboardView';
import ManageMoviesView from './components/ManageMoviesView';
import ManageShowtimesView from './components/ManageShowtimesView';
import ViewBookingsView from './components/ViewBookingsView';
import { Menu, X, RotateCcw, Award, CheckCircle, Database, HelpCircle } from 'lucide-react';

export default function AdminLayout() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(null);

  // Core Data States
  const [movies, setMovies] = useState([]);
  const [screens, setScreens] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Load Initial Data
  useEffect(() => {
    const data = getLocalStorageData();
    setMovies(data.movies);
    setScreens(data.screens);
    setShowtimes(data.showtimes);
    setBookings(data.bookings);
  }, []);

  // Helper trigger notification
  const triggerNotification = (message) => {
    setShowNotification(message);
    setTimeout(() => {
      setShowNotification(null);
    }, 4000);
  };

  // Movie CRUD Handlers
  const handleAddMovie = (newMovie) => {
    const movie = {
      ...newMovie,
      id: `movie-${Date.now()}`
    };
    const updated = [movie, ...movies];
    setMovies(updated);
    saveToLocalStorage('cinema_movies', updated);
    triggerNotification(`"${movie.title}" successfully registered in database.`);
  };

  const handleEditMovie = (updatedMovie) => {
    const updated = movies.map(m => m.id === updatedMovie.id ? updatedMovie : m);
    setMovies(updated);
    saveToLocalStorage('cinema_movies', updated);
    triggerNotification(`"${updatedMovie.title}" records successfully updated.`);
  };

  const handleDeleteMovie = (id) => {
    const movie = movies.find(m => m.id === id);
    const updated = movies.filter(m => m.id !== id);
    setMovies(updated);
    saveToLocalStorage('cinema_movies', updated);

    // Cascade delete associated showtimes and bookings! (Transactional Integrity)
    const affectedShowtimes = showtimes.filter(s => s.movieId === id);
    const affectedShowtimeIds = affectedShowtimes.map(s => s.id);
    
    const updatedShowtimes = showtimes.filter(s => s.movieId !== id);
    setShowtimes(updatedShowtimes);
    saveToLocalStorage('cinema_showtimes', updatedShowtimes);

    const updatedBookings = bookings.filter(b => !affectedShowtimeIds.includes(b.showtimeId));
    setBookings(updatedBookings);
    saveToLocalStorage('cinema_bookings', updatedBookings);

    triggerNotification(`Movie deleted. Cascading removed ${affectedShowtimes.length} showtimes and related bookings.`);
  };

  // Showtime Schedule Handler with Conflict Guard
  const handleAddShowtime = (newShowtime) => {
    const movie = movies.find(m => m.id === newShowtime.movieId);
    const screen = screens.find(s => s.id === newShowtime.screenId);
    if (!movie || !screen) return { success: false, error: 'Movie or screen missing.' };

    const newStart = new Date(newShowtime.dateTime);
    // Overlap buffer: movie duration + 15m cleaning
    const newEnd = new Date(newStart.getTime() + (movie.duration + 15) * 60 * 1000);

    // Search for scheduling collisions on this specific screen
    for (const st of showtimes) {
      if (st.screenId !== newShowtime.screenId) continue;

      const stMovie = movies.find(m => m.id === st.movieId);
      if (!stMovie) continue;

      const stStart = new Date(st.dateTime);
      const stEnd = new Date(stStart.getTime() + (stMovie.duration + 15) * 60 * 1000);

      // Simple overlap intersection check: (StartA < EndB) && (EndA > StartB)
      if (newStart < stEnd && newEnd > stStart) {
        return {
          success: false,
          error: `Schedule conflict on ${screen.name}! "${stMovie.title}" is already scheduled from ${stStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to ${stEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
        };
      }
    }

    const showtime = {
      ...newShowtime,
      id: `showtime-${Date.now()}`,
      bookedSeats: []
    };

    const updated = [showtime, ...showtimes];
    setShowtimes(updated);
    saveToLocalStorage('cinema_showtimes', updated);
    triggerNotification(`Showtime slot created for "${movie.title}" on ${screen.name}.`);
    return { success: true };
  };

  const handleDeleteShowtime = (id) => {
    const updated = showtimes.filter(s => s.id !== id);
    setShowtimes(updated);
    saveToLocalStorage('cinema_showtimes', updated);

    // Cascade cancel bookings for this showtime
    const updatedBookings = bookings.map(b => b.showtimeId === id ? { ...b, status: 'Cancelled' } : b);
    setBookings(updatedBookings);
    saveToLocalStorage('cinema_bookings', updatedBookings);

    triggerNotification(`Showtime slot removed. Bookings for this showtime have been cancelled.`);
  };

  // Ticket Booking Handlers
  const handleAddBooking = (newBooking) => {
    const booking = {
      ...newBooking,
      id: `booking-${Date.now()}`,
      bookingTime: new Date().toISOString()
    };

    // Append these booked seats to the showtime (Reserve seats in showtime)
    const showtime = showtimes.find(st => st.id === booking.showtimeId);
    if (!showtime) return { success: false, error: 'Scheduled showtime slot missing.' };

    // Check double-booking race conditions
    const alreadyTaken = booking.seatsBooked.filter(seat => showtime.bookedSeats.includes(seat));
    if (alreadyTaken.length > 0) {
      return {
        success: false,
        error: `Seats double-booking guard! The following seats were just purchased by another transaction: ${alreadyTaken.join(', ')}`
      };
    }

    // Book seats in state
    const updatedShowtimes = showtimes.map(st => {
      if (st.id === booking.showtimeId) {
        return {
          ...st,
          bookedSeats: [...st.bookedSeats, ...booking.seatsBooked]
        };
      }
      return st;
    });

    setShowtimes(updatedShowtimes);
    saveToLocalStorage('cinema_showtimes', updatedShowtimes);

    const updatedBookings = [booking, ...bookings];
    setBookings(updatedBookings);
    saveToLocalStorage('cinema_bookings', updatedBookings);

    triggerNotification(`Ticket successfully issued to ${booking.customerName} (${booking.seatsBooked.length} seats).`);
    return { success: true };
  };

  const handleCancelBooking = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    // Release seats from showtime
    const updatedShowtimes = showtimes.map(st => {
      if (st.id === booking.showtimeId) {
        return {
          ...st,
          bookedSeats: st.bookedSeats.filter(seat => !booking.seatsBooked.includes(seat))
        };
      }
      return st;
    });

    setShowtimes(updatedShowtimes);
    saveToLocalStorage('cinema_showtimes', updatedShowtimes);

    // Mark booking as cancelled
    const updatedBookings = bookings.map(b => b.id === bookingId ? { ...b, status: 'Cancelled' } : b);
    setBookings(updatedBookings);
    saveToLocalStorage('cinema_bookings', updatedBookings);

    triggerNotification(`Booking ${bookingId.substring(0, 8)} successfully cancelled. Seats released.`);
  };

  // Master Database Reset
  const handleResetDatabase = () => {
    if (window.confirm('Are you sure you want to reset the admin database to its default hackathon seed records? Any custom movies, showtimes, and bookings will be cleared.')) {
      localStorage.removeItem('cinema_movies');
      localStorage.removeItem('cinema_screens');
      localStorage.removeItem('cinema_showtimes');
      localStorage.removeItem('cinema_bookings');
      
      const data = getLocalStorageData();
      setMovies(data.movies);
      setScreens(data.screens);
      setShowtimes(data.showtimes);
      setBookings(data.bookings);

      triggerNotification('Admin database successfully restored to standard hackathon mock seeds!');
    }
  };

  return (
    <div className="min-h-screen bg-hotstar-bg flex flex-col lg:flex-row antialiased font-sans text-gray-200">
      
      {/* Toast Notification HUD */}
      {showNotification && (
        <div className="fixed top-5 right-5 z-[100] bg-hotstar-card border border-emerald-500/30 shadow-xl shadow-black/60 rounded-xl p-4 flex items-center space-x-3 max-w-sm animate-bounce">
          <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-full">
            <CheckCircle size={18} />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Database Operations Log</p>
            <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{showNotification}</p>
          </div>
        </div>
      )}

      {/* Mobile Top Header */}
      <header className="lg:hidden bg-hotstar-sidebar border-b border-gray-800 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-hotstar-accent to-blue-500 flex items-center justify-center text-white">
            <Database size={16} />
          </div>
          <span className="font-bold text-sm text-white tracking-tight">
            HotstarCine<span className="text-hotstar-accent font-light">Admin</span>
          </span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Main Layout Container */}
      <div className="flex flex-col lg:flex-row flex-1 relative">
        
        {/* Admin Navigation Sidebar (Hidden on mobile unless open) */}
        <div className={`lg:block ${isMobileMenuOpen ? 'block' : 'hidden'} absolute lg:relative inset-y-0 left-0 z-40 w-full lg:w-auto h-full lg:h-auto shrink-0 bg-hotstar-sidebar`}>
          <div className="h-full flex flex-col">
            {/* Close Mobile Menu Button */}
            {isMobileMenuOpen && (
              <div className="p-4 flex justify-end lg:hidden border-b border-gray-800 bg-hotstar-sidebar">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>
            )}
            <AdminSidebar
              currentView={currentView}
              onViewChange={(view) => {
                setCurrentView(view);
                setIsMobileMenuOpen(false);
              }}
              moviesCount={movies.length}
              showtimesCount={showtimes.length}
              bookingsCount={bookings.filter(b => b.status === 'Confirmed').length}
            />
          </div>
        </div>

        {/* Content Panel Area */}
        <main className="flex-1 min-w-0 flex flex-col h-full bg-hotstar-bg">
          
          {/* Top Panel Bar */}
          <div className="px-6 py-4 border-b border-gray-800/60 bg-hotstar-sidebar/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            {/* Current route navigation hint */}
            <div className="flex items-center space-x-2 text-xs font-medium text-gray-400">
              <span className="hover:text-white transition-colors cursor-pointer" onClick={() => setCurrentView('dashboard')}>Console</span>
              <span>/</span>
              <span className="text-white capitalize">{currentView.replace('-', ' ')}</span>
            </div>

            {/* Quick action tools */}
            <div className="flex items-center space-x-3 text-xs">
              <span className="hidden sm:inline-block text-[10px] bg-hotstar-card border border-white/5 text-gray-400 px-2.5 py-1 rounded font-mono">
                ENV: HACKATHON_SANDBOX_STABLE
              </span>
              <button
                onClick={handleResetDatabase}
                className="flex items-center space-x-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-all"
                title="Reset local storage seed records to defaults"
              >
                <RotateCcw size={12} className="animate-spin-slow" />
                <span>Reset Seed Data</span>
              </button>
            </div>
          </div>

          {/* Core View Container */}
          <div className="p-6 overflow-y-auto flex-1">
            {currentView === 'dashboard' && (
              <DashboardView
                movies={movies}
                screens={screens}
                showtimes={showtimes}
                bookings={bookings}
                onNavigateToView={(view) => setCurrentView(view)}
              />
            )}
            {currentView === 'movies' && (
              <ManageMoviesView
                movies={movies}
                onAddMovie={handleAddMovie}
                onEditMovie={handleEditMovie}
                onDeleteMovie={handleDeleteMovie}
              />
            )}
            {currentView === 'showtimes' && (
              <ManageShowtimesView
                movies={movies}
                screens={screens}
                showtimes={showtimes}
                onAddShowtime={handleAddShowtime}
                onDeleteShowtime={handleDeleteShowtime}
              />
            )}
            {currentView === 'bookings' && (
              <ViewBookingsView
                movies={movies}
                screens={screens}
                showtimes={showtimes}
                bookings={bookings}
                onAddBooking={handleAddBooking}
                onCancelBooking={handleCancelBooking}
              />
            )}
          </div>
        </main>

      </div>
    </div>
  );
}