import React, { useState } from 'react';
import { Search, Plus, Ticket, Users, Mail, Calendar, HelpCircle, X, Check, Trash2, Ban } from 'lucide-react';
import BackendBlueprint from './BackendBlueprint';

export default function ViewBookingsView({
  movies,
  screens,
  showtimes,
  bookings,
  onAddBooking,
  onCancelBooking
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMovieId, setFilterMovieId] = useState('All');
  
  // Booking creation states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Form Fields
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [selectedShowtimeId, setSelectedShowtimeId] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Get active showtime details
  const activeShowtime = showtimes.find(st => st.id === selectedShowtimeId);
  const activeScreen = activeShowtime ? screens.find(s => s.id === activeShowtime.screenId) : null;
  const activeMovie = activeShowtime ? movies.find(m => m.id === activeShowtime.movieId) : null;

  // Open the add booking form
  const handleOpenAddForm = () => {
    setCustName('');
    setCustEmail('');
    setCustPhone('');
    setSelectedSeats([]);
    setErrorMessage(null);

    // Default to first showtime if available
    if (showtimes.length > 0) {
      setSelectedShowtimeId(showtimes[0].id);
    } else {
      setSelectedShowtimeId('');
    }

    setIsFormOpen(true);
  };

  // Seat generation logic based on rows/cols
  const generateSeatMap = () => {
    if (!activeScreen) return { rows: [], cols: [] };
    const rows = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').slice(0, activeScreen.rows);
    const cols = Array.from({ length: activeScreen.cols }, (_, i) => i + 1);
    
    return { rows, cols };
  };

  const handleSeatClick = (seatCode, isBooked) => {
    if (isBooked) return; // Cannot select booked seats

    if (selectedSeats.includes(seatCode)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatCode));
    } else {
      setSelectedSeats(prev => [...prev, seatCode]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!custName || !custEmail || !selectedShowtimeId) {
      setErrorMessage('Please fill in customer details and select a showtime.');
      return;
    }

    if (selectedSeats.length === 0) {
      setErrorMessage('Please select at least one seat from the interactive map.');
      return;
    }

    const pricePerSeat = activeShowtime ? activeShowtime.price : 12.00;
    const totalPrice = selectedSeats.length * pricePerSeat;

    const res = onAddBooking({
      showtimeId: selectedShowtimeId,
      customerName: custName.trim(),
      customerEmail: custEmail.trim(),
      customerPhone: custPhone.trim(),
      seatsBooked: selectedSeats,
      totalPrice,
      status: 'Confirmed'
    });

    if (res.success) {
      setIsFormOpen(false);
      setErrorMessage(null);
    } else {
      setErrorMessage(res.error || 'Booking creation failed.');
    }
  };

  // Filter Bookings logic
  const filteredBookings = bookings.filter(b => {
    // Search filter (name, email, phone)
    const matchesSearch = b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.customerPhone.includes(searchTerm);
    
    // Movie filter
    let matchesMovie = true;
    if (filterMovieId !== 'All') {
      const showtime = showtimes.find(st => st.id === b.showtimeId);
      matchesMovie = showtime ? showtime.movieId === filterMovieId : false;
    }

    return matchesSearch && matchesMovie;
  });

  return (
    <div id="view-bookings-container" className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">View Bookings</h2>
          <p className="text-gray-400 text-xs">Track spectator admissions, register offline ticket sales, and cancel reservations.</p>
        </div>
        <button
          onClick={handleOpenAddForm}
          disabled={showtimes.length === 0}
          className="bg-hotstar-accent hover:bg-opacity-95 disabled:opacity-40 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-all shadow-lg shadow-hotstar-accent/15 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>New Ticket Sale</span>
        </button>
      </div>

      {/* Filters bar */}
      <div className="p-4 bg-hotstar-card/60 rounded-xl border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search by customer name, email, or telephone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-hotstar-bg text-sm rounded-lg border border-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-hotstar-accent/50 transition-colors"
          />
        </div>

        {/* Filter by Movie */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs text-gray-400 font-medium">Movie:</span>
          <select
            value={filterMovieId}
            onChange={(e) => setFilterMovieId(e.target.value)}
            className="bg-hotstar-bg text-xs border border-gray-800 text-gray-200 py-2 px-3.5 rounded-lg focus:outline-none focus:border-hotstar-accent"
          >
            <option value="All">All Scheduled Movies</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>{movie.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Booking Form with Interactive Seat Map (Modal) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-hotstar-card border border-gray-800 rounded-xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-hotstar-sidebar shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 bg-hotstar-accent/10 rounded-lg text-hotstar-accent">
                  <Ticket size={18} />
                </div>
                <h3 className="font-semibold text-white text-sm">Register Offline Box Office Ticket</h3>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-white p-1">
                <X size={18} />
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mx-6 mt-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-xs shrink-0">
                {errorMessage}
              </div>
            )}

            {/* Modal Body - 2 Columns (Form left, Seat map right) */}
            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Form: Customer Meta */}
              <form onSubmit={handleSubmit} id="booking-meta-form" className="lg:col-span-4 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer Details</h4>
                  
                  {/* Name */}
                  <div>
                    <label className="block text-[11px] text-gray-400 font-semibold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      className="w-full bg-hotstar-bg border border-gray-800 px-3 py-2 rounded-lg text-xs text-white focus:outline-none focus:border-hotstar-accent"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[11px] text-gray-400 font-semibold mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="john.doe@gmail.com"
                      value={custEmail}
                      onChange={(e) => setCustEmail(e.target.value)}
                      className="w-full bg-hotstar-bg border border-gray-800 px-3 py-2 rounded-lg text-xs text-white focus:outline-none focus:border-hotstar-accent"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[11px] text-gray-400 font-semibold mb-1">Telephone</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={custPhone}
                      onChange={(e) => setCustPhone(e.target.value)}
                      className="w-full bg-hotstar-bg border border-gray-800 px-3 py-2 rounded-lg text-xs text-white focus:outline-none focus:border-hotstar-accent"
                    />
                  </div>

                  {/* Showtime Selector */}
                  <div>
                    <label className="block text-[11px] text-gray-400 font-semibold mb-1">Select Showtime *</label>
                    <select
                      required
                      value={selectedShowtimeId}
                      onChange={(e) => {
                        setSelectedShowtimeId(e.target.value);
                        setSelectedSeats([]); // Reset seats on showtime change
                      }}
                      className="w-full bg-hotstar-bg border border-gray-800 px-3 py-2 rounded-lg text-xs text-white focus:outline-none focus:border-hotstar-accent"
                    >
                      <option value="" disabled>-- Choose Showtime --</option>
                      {showtimes.map((st) => {
                        const m = movies.find(movie => movie.id === st.movieId);
                        const s = screens.find(scr => scr.id === st.screenId);
                        if (!m || !s) return null;
                        
                        const timeStr = new Date(st.dateTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                        return (
                          <option key={st.id} value={st.id}>
                            {m.title} - {s.name} ({timeStr})
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* Pricing / Seat Summary */}
                <div className="pt-4 border-t border-gray-800/80 bg-hotstar-bg/30 p-3.5 rounded-lg space-y-2 mt-4">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Selected Seats:</span>
                    <span className="font-mono text-white font-semibold">
                      {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Ticket Price:</span>
                    <span className="font-mono text-white">
                      ${activeShowtime ? activeShowtime.price.toFixed(2) : '0.00'} each
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold border-t border-gray-800/80 pt-2 text-white">
                    <span>Total Cost:</span>
                    <span className="font-mono text-hotstar-gold text-base">
                      ${((activeShowtime ? activeShowtime.price : 12.00) * selectedSeats.length).toFixed(2)}
                    </span>
                  </div>
                </div>
              </form>

              {/* Right Column: Seat Plan Canvas */}
              <div className="lg:col-span-8 bg-hotstar-bg/40 border border-gray-800 rounded-xl p-5 flex flex-col justify-between overflow-hidden">
                <div className="w-full text-center space-y-1 select-none shrink-0">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Screen Layout Allocation</h4>
                  <p className="text-[10px] text-gray-500">Pick seats from the interactive map below. Double-clicking reserved seats is forbidden.</p>
                </div>

                {/* Curved theater screen */}
                <div className="relative my-6 select-none shrink-0">
                  <div className="w-4/5 mx-auto h-2.5 bg-gradient-to-b from-hotstar-accent/50 to-transparent rounded-t-[100px] border-t-2 border-hotstar-accent shadow-[0_-12px_24px_rgba(31,128,224,0.3)]"></div>
                  <div className="text-[9px] uppercase tracking-widest text-hotstar-accent font-bold text-center mt-2">
                    Cinema Stage Screen
                  </div>
                </div>

                {/* Seat Matrix Grid */}
                <div className="flex-1 overflow-auto flex items-center justify-center p-3 select-none">
                  {activeShowtime && activeScreen ? (
                    <div className="space-y-1.5 min-w-max">
                      {(() => {
                        const { rows, cols } = generateSeatMap();
                        return rows.map((rowName) => (
                          <div key={rowName} className="flex items-center space-x-1.5">
                            {/* Row Label */}
                            <span className="w-4 text-center text-xs font-bold text-gray-600 font-mono select-none">
                              {rowName}
                            </span>
                            {/* Seats in Row */}
                            {cols.map((colNum) => {
                              const seatCode = `${rowName}${colNum}`;
                              const isBooked = activeShowtime.bookedSeats.includes(seatCode);
                              const isSelected = selectedSeats.includes(seatCode);

                              return (
                                <button
                                  key={seatCode}
                                  type="button"
                                  disabled={isBooked}
                                  onClick={() => handleSeatClick(seatCode, isBooked)}
                                  className={`w-6 h-6 rounded-md text-[8px] font-mono font-bold transition-all flex items-center justify-center ${
                                    isBooked
                                      ? 'bg-gray-800 text-gray-600 border border-gray-900 cursor-not-allowed'
                                      : isSelected
                                      ? 'bg-hotstar-accent text-white border border-white/20 shadow-md shadow-hotstar-accent/20'
                                      : 'bg-hotstar-card-light/50 hover:bg-hotstar-accent/30 text-gray-300 border border-white/5 hover:border-hotstar-accent/30 cursor-pointer'
                                  }`}
                                  title={`${seatCode} ${isBooked ? '(Booked)' : '(Available)'}`}
                                >
                                  {colNum}
                                </button>
                              );
                            })}
                          </div>
                        ));
                      })()}
                    </div>
                  ) : (
                    <div className="text-center text-xs text-gray-500 py-12">
                      Please choose an active showtime from the left panel to load the seat map layout.
                    </div>
                  )}
                </div>

                {/* Legends */}
                <div className="flex justify-center items-center space-x-5 text-[10px] text-gray-400 mt-4 border-t border-gray-800 pt-3 select-none shrink-0">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3.5 h-3.5 bg-hotstar-card-light/50 border border-white/5 rounded"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3.5 h-3.5 bg-hotstar-accent border border-white/20 rounded"></div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3.5 h-3.5 bg-gray-800 border border-gray-900 rounded"></div>
                    <span>Occupied / Booked</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 border-t border-gray-800 bg-hotstar-sidebar flex justify-end space-x-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
              >
                Close Map
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={selectedSeats.length === 0}
                className="bg-hotstar-accent hover:bg-opacity-90 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                Issue Ticket (${((activeShowtime ? activeShowtime.price : 12.00) * selectedSeats.length).toFixed(2)})
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Bookings Spreadsheet/Listing Table */}
      <div className="p-6 bg-hotstar-card rounded-xl border border-gray-800 overflow-hidden">
        <h3 className="text-sm font-semibold text-white tracking-tight uppercase text-gray-400 mb-5">
          Spectator Bookings Logs ({filteredBookings.length} bookings)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase text-[10px] tracking-wider font-semibold bg-hotstar-sidebar/40">
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Showtime / Screen</th>
                <th className="py-3 px-4">Booked Seats</th>
                <th className="py-3 px-4">Total Paid</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {filteredBookings.map((bk) => {
                const showtime = showtimes.find(st => st.id === bk.showtimeId);
                const movie = showtime ? movies.find(m => m.id === showtime.movieId) : null;
                const screen = showtime ? screens.find(s => s.id === showtime.screenId) : null;

                const formattedBookingTime = new Date(bk.bookingTime).toLocaleString([], {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <tr key={bk.id} className="hover:bg-hotstar-bg/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-gray-500 font-semibold">
                      {bk.id.substring(0, 8)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col space-y-0.5">
                        <span className="font-semibold text-white">{bk.customerName}</span>
                        <span className="text-[10px] text-gray-400 flex items-center">
                          <Mail size={10} className="mr-1 text-hotstar-accent" /> {bk.customerEmail}
                        </span>
                        {bk.customerPhone && (
                          <span className="text-[10px] text-gray-500 font-mono">{bk.customerPhone}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {movie ? (
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">{movie.title}</span>
                          <span className="text-[10px] text-gray-400">
                            {screen ? screen.name : 'Deleted Screen'} •{' '}
                            {new Date(showtime.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">Showtime Deleted</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {bk.seatsBooked.map((seat, i) => (
                          <span key={i} className="bg-hotstar-accent/10 border border-hotstar-accent/20 text-hotstar-accent font-mono text-[10px] font-semibold px-2 py-0.5 rounded">
                            {seat}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      ${bk.totalPrice.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${
                        bk.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        bk.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {bk.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {bk.status === 'Confirmed' ? (
                        <button
                          onClick={() => onCancelBooking(bk.id)}
                          className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-2.5 py-1.5 rounded-lg border border-rose-500/10 hover:border-rose-500/20 transition-all flex items-center space-x-1 mx-auto"
                          title="Void / Cancel Ticket Booking"
                        >
                          <Ban size={12} />
                          <span>Cancel Ticket</span>
                        </button>
                      ) : (
                        <span className="text-gray-500 text-[10px]">Cancelled</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    <Ticket className="mx-auto text-gray-600 mb-3" size={32} />
                    <h4 className="text-sm font-semibold text-white">No Bookings Logs Found</h4>
                    <p className="text-xs text-gray-400 mt-1">Search or add standard tickets using the "New Ticket Sale" option.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Backend Blueprint */}
      <BackendBlueprint scope="bookings" />
    </div>
  );
}