import React, { useState } from 'react';
import { Plus, Trash2, Calendar, Film, MapPin, DollarSign, Clock, Users, X, Info, ShieldAlert } from 'lucide-react';
import BackendBlueprint from './BackendBlueprint';

export default function ManageShowtimesView({
  movies,
  screens,
  showtimes,
  onAddShowtime,
  onDeleteShowtime
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Form Fields
  const [selectedMovieId, setSelectedMovieId] = useState('');
  const [selectedScreenId, setSelectedScreenId] = useState('');
  const [dateTime, setDateTime] = useState('2026-07-09T18:00');
  const [price, setPrice] = useState(15.00);

  // Initialize add form
  const handleOpenAddForm = () => {
    // Select first active movie
    const activeMovies = movies.filter(m => m.isActive);
    if (activeMovies.length > 0) {
      setSelectedMovieId(activeMovies[0].id);
    } else {
      setSelectedMovieId('');
    }

    if (screens.length > 0) {
      setSelectedScreenId(screens[0].id);
    }

    setDateTime('2026-07-09T18:00');
    setPrice(15.00);
    setErrorMessage(null);
    setIsFormOpen(true);
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMovieId || !selectedScreenId || !dateTime) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    const res = onAddShowtime({
      movieId: selectedMovieId,
      screenId: selectedScreenId,
      dateTime,
      price: Number(price) || 12.00
    });

    if (res.success) {
      setIsFormOpen(false);
      setErrorMessage(null);
    } else {
      setErrorMessage(res.error || 'An error occurred.');
    }
  };

  // Group or sort showtimes by date/time
  const sortedShowtimes = [...showtimes].sort((a, b) => {
    return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
  });

  return (
    <div id="manage-showtimes-container" className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Manage Showtimes</h2>
          <p className="text-gray-400 text-xs">Coordinate cinema screens, allocate slots to movies, set ticket pricing, and prevent schedule clashes.</p>
        </div>
        <button
          onClick={handleOpenAddForm}
          className="bg-hotstar-accent hover:bg-opacity-95 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-all shadow-lg shadow-hotstar-accent/15 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Schedule Showtime</span>
        </button>
      </div>

      {/* Form Dialog Panel (Modal style) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-hotstar-card border border-gray-800 rounded-xl max-w-md w-full shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-hotstar-sidebar">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 bg-hotstar-accent/10 rounded-lg text-hotstar-accent">
                  <Calendar size={18} />
                </div>
                <h3 className="font-semibold text-white text-base">Schedule Movie Showtime</h3>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-white p-1">
                <X size={18} />
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mx-5 mt-5 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-xs flex items-start space-x-2">
                <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Select Movie */}
              <div>
                <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                  Select Movie <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={selectedMovieId}
                  onChange={(e) => setSelectedMovieId(e.target.value)}
                  className="w-full bg-hotstar-bg border border-gray-800 px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none focus:border-hotstar-accent"
                >
                  <option value="" disabled>-- Choose listed movie --</option>
                  {movies.filter(m => m.isActive).map((movie) => (
                    <option key={movie.id} value={movie.id}>{movie.title} ({movie.duration}m)</option>
                  ))}
                </select>
                {movies.filter(m => m.isActive).length === 0 && (
                  <p className="text-[10px] text-rose-400 mt-1">No listed movies found. Please set at least one movie to "Listed" first.</p>
                )}
              </div>

              {/* Select Screen/Hall */}
              <div>
                <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                  Cinema Screen Room <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={selectedScreenId}
                  onChange={(e) => setSelectedScreenId(e.target.value)}
                  className="w-full bg-hotstar-bg border border-gray-800 px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none focus:border-hotstar-accent"
                >
                  <option value="" disabled>-- Choose Screen --</option>
                  {screens.map((screen) => (
                    <option key={screen.id} value={screen.id}>
                      {screen.name} ({screen.type} - {screen.totalSeats} seats)
                    </option>
                  ))}
                </select>
              </div>

              {/* DateTime */}
              <div>
                <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                  Date & Showtime <span className="text-rose-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full bg-hotstar-bg border border-gray-800 px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none focus:border-hotstar-accent"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                  Base Ticket Price ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
                  <input
                    type="number"
                    step="0.50"
                    min="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-hotstar-bg border border-gray-800 pl-8 pr-3 py-2.5 rounded-lg text-sm text-white focus:outline-none focus:border-hotstar-accent font-mono"
                  />
                </div>
              </div>

              {/* Alert note */}
              <div className="p-3 bg-hotstar-bg rounded-lg border border-gray-800 text-[10px] text-gray-400 flex items-start space-x-2">
                <Info size={14} className="text-hotstar-accent shrink-0 mt-0.5" />
                <p>
                  <span className="font-semibold text-white">Conflict Checking:</span> In-memory logic will automatically verify that this screen room is not scheduled with overlapping movies (duration + 15m cleaning buffer) during this timeframe.
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-gray-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={movies.filter(m => m.isActive).length === 0}
                  className="bg-hotstar-accent hover:bg-opacity-90 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Showtimes List Layout */}
      <div className="p-6 bg-hotstar-card rounded-xl border border-gray-800">
        <h3 className="text-sm font-semibold text-white tracking-tight uppercase text-gray-400 mb-5">
          Active Theater Schedule ({sortedShowtimes.length} slots)
        </h3>

        <div className="space-y-4">
          {sortedShowtimes.map((st) => {
            const movie = movies.find(m => m.id === st.movieId);
            const screen = screens.find(s => s.id === st.screenId);
            if (!movie || !screen) return null;

            const occupiedCount = st.bookedSeats.length;
            const fillRate = Math.round((occupiedCount / screen.totalSeats) * 100);

            // Date formatter
            const showDate = new Date(st.dateTime);
            const formattedDate = showDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
            const formattedTime = showDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div
                key={st.id}
                className="bg-hotstar-bg/50 rounded-xl border border-gray-800/80 p-4 hover:border-gray-700/80 transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                {/* Movie & Screen Info */}
                <div className="flex items-start space-x-4">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-12 h-16 rounded object-cover border border-gray-800 shrink-0 mt-0.5"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm hover:text-hotstar-accent transition-colors">
                      {movie.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center">
                      <MapPin size={11} className="mr-1 text-hotstar-accent" /> {screen.name}
                      <span className="mx-2 text-gray-600">•</span>
                      <span className="font-semibold text-white">{screen.type}</span>
                    </p>
                    <div className="flex items-center space-x-3 text-[10px] text-gray-400 font-mono mt-2 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full w-max">
                      <span className="flex items-center text-hotstar-gold"><Clock size={10} className="mr-1" /> {movie.duration} min</span>
                      <span className="text-gray-600">|</span>
                      <span>{movie.language}</span>
                    </div>
                  </div>
                </div>

                {/* Date & Time block */}
                <div className="flex flex-row md:flex-col items-center md:items-start justify-between border-t md:border-t-0 border-gray-800/80 pt-3 md:pt-0 gap-1.5 shrink-0">
                  <div className="flex items-center text-xs font-semibold text-white">
                    <Calendar size={13} className="mr-1.5 text-hotstar-accent" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="font-mono text-sm font-bold text-hotstar-accent md:pl-5">
                    {formattedTime}
                  </div>
                </div>

                {/* Ticket pricing & Occupancy metrics */}
                <div className="flex items-center justify-between border-t md:border-t-0 border-gray-800/80 pt-3 md:pt-0 gap-6 shrink-0">
                  {/* Pricing */}
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">Base Price</span>
                    <span className="text-sm font-bold text-white font-mono mt-0.5">${st.price.toFixed(2)}</span>
                  </div>

                  {/* Seat stats */}
                  <div className="flex flex-col w-28">
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-semibold mb-1">
                      <span>SEATS</span>
                      <span>{occupiedCount}/{screen.totalSeats} ({fillRate}%)</span>
                    </div>
                    <div className="w-full bg-hotstar-card h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          fillRate > 75 ? 'bg-emerald-400' :
                          fillRate > 35 ? 'bg-yellow-400' : 'bg-gray-500'
                        }`}
                        style={{ width: `${Math.min(fillRate, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => onDeleteShowtime(st.id)}
                    className="p-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 hover:text-rose-300 rounded-lg transition-colors ml-2 self-end md:self-center"
                    title="Delete showtime schedule"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

              </div>
            );
          })}

          {sortedShowtimes.length === 0 && (
            <div className="p-12 bg-hotstar-bg/30 rounded-xl border border-dashed border-gray-800 text-center flex flex-col items-center justify-center">
              <Calendar className="text-gray-500 mb-3" size={32} />
              <h4 className="text-sm font-semibold text-white">No Scheduled Showtimes</h4>
              <p className="text-gray-400 text-xs mt-1">Select "Schedule Showtime" to link listed movies to specific screen halls.</p>
            </div>
          )}
        </div>
      </div>

      {/* Backend Blueprint */}
      <BackendBlueprint scope="showtimes" />
    </div>
  );
}