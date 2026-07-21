import React from 'react';
import { DollarSign, Film, Calendar, Users, Percent, ArrowUpRight, Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import BackendBlueprint from './BackendBlueprint';

export default function DashboardView({
  movies,
  screens,
  showtimes,
  bookings,
  onNavigateToView
}) {
  // Calculate stats
  const activeBookings = bookings.filter(b => b.status === 'Confirmed');
  const totalRevenue = activeBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const activeMoviesCount = movies.filter(m => m.isActive).length;
  const totalShowtimesCount = showtimes.length;

  // Calculate overall occupancy rate
  let totalCap = 0;
  let totalBooked = 0;
  showtimes.forEach(st => {
    const scr = screens.find(s => s.id === st.screenId);
    if (scr) {
      totalCap += scr.totalSeats;
      totalBooked += st.bookedSeats.length;
    }
  });
  const occupancyRate = totalCap > 0 ? Math.round((totalBooked / totalCap) * 100) : 0;

  // Revenue by Movie for a simple visual breakdown
  const movieRevenue = movies.map(m => {
    const movieShowtimes = showtimes.filter(s => s.movieId === m.id);
    const movieShowtimeIds = movieShowtimes.map(s => s.id);
    const movieBookings = activeBookings.filter(b => movieShowtimeIds.includes(b.showtimeId));
    const revenue = movieBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    return {
      title: m.title,
      revenue,
      poster: m.posterUrl,
    };
  }).sort((a, b) => b.revenue - a.revenue);

  // Stats cards data
  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      iconColor: 'text-emerald-400 bg-emerald-500/10',
      change: '+14.2% from last week',
      changeColor: 'text-green-500'
    },
    {
      title: 'Active Movies',
      value: activeMoviesCount.toString(),
      icon: Film,
      iconColor: 'text-[#1f80e0] bg-[#1f80e0]/10',
      change: '2 new releases added',
      changeColor: 'text-green-500'
    },
    {
      title: 'Showtimes Scheduled',
      value: totalShowtimesCount.toString(),
      icon: Calendar,
      iconColor: 'text-indigo-400 bg-indigo-500/10',
      change: 'Covering 3 screens',
      changeColor: 'text-gray-500'
    },
    {
      title: 'Avg. Occupancy Rate',
      value: `${occupancyRate}%`,
      icon: Percent,
      iconColor: 'text-[#1f80e0] bg-[#1f80e0]/10',
      change: 'Seat booking trend rising',
      changeColor: 'text-[#1f80e0]'
    }
  ];

  return (
    <div id="dashboard-view-container" className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Overview</h2>
        <p className="text-gray-400 text-sm">Welcome back, manage your cinema operations here.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-hotstar-card p-6 rounded-xl border border-gray-800 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`p-2.5 rounded-lg ${stat.iconColor}`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className={`mt-2 text-xs font-medium ${stat.changeColor}`}>
                {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Split Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column - Occupancy & Showtimes Progress (Span 2) */}
        <div className="xl:col-span-2 space-y-6">
          {/* Movie Sales breakdown with nice CSS Progress bars */}
          <div className="p-6 bg-hotstar-card rounded-xl border border-gray-800">
            <h3 className="text-sm font-semibold text-white tracking-tight mb-4 uppercase text-gray-400">
              Box Office Revenue by Movie
            </h3>
            
            <div className="space-y-4">
              {movieRevenue.slice(0, 4).map((item, idx) => {
                const maxRevenue = Math.max(...movieRevenue.map(m => m.revenue), 1);
                const percent = (item.revenue / maxRevenue) * 100;
                return (
                  <div key={idx} className="flex items-center space-x-4">
                    <img
                      src={item.poster}
                      alt={item.title}
                      className="w-10 h-14 rounded-md object-cover border border-gray-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-white truncate">{item.title}</span>
                        <span className="font-mono text-hotstar-gold font-bold">${item.revenue.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-hotstar-bg rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-hotstar-accent to-blue-400 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {movieRevenue.length === 0 && (
                <div className="text-center py-6 text-xs text-gray-500">
                  No movies in system. Add some in Manage Movies!
                </div>
              )}
            </div>
          </div>

          {/* Active Showtimes Status */}
          <div className="p-6 bg-hotstar-card rounded-xl border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white tracking-tight uppercase text-gray-400">
                Upcoming Showtimes Capacity
              </h3>
              <button
                onClick={() => onNavigateToView('showtimes')}
                className="text-xs text-hotstar-accent hover:underline flex items-center space-x-1"
              >
                <span>Edit schedule</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {showtimes.slice(0, 4).map((st) => {
                const movie = movies.find(m => m.id === st.movieId);
                const screen = screens.find(s => s.id === st.screenId);
                if (!movie || !screen) return null;

                const occupied = st.bookedSeats.length;
                const capacity = screen.totalSeats;
                const fillPercent = Math.round((occupied / capacity) * 100);

                // Formatting DateTime nicely
                const date = new Date(st.dateTime);
                const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <div key={st.id} className="p-4 rounded-xl bg-white/5 border border-gray-800 flex flex-col justify-between space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{movie.title}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5 font-mono">{screen.name}</p>
                      </div>
                      <span className="text-[10px] bg-white/5 border border-white/10 text-white px-2 py-0.5 rounded font-semibold font-mono flex items-center shrink-0">
                        <Clock size={10} className="mr-1 text-hotstar-accent" /> {timeString}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-gray-400">Occupancy</span>
                        <span className={`font-semibold ${
                          fillPercent > 75 ? 'text-emerald-400 font-bold' :
                          fillPercent > 30 ? 'text-yellow-400' : 'text-gray-400'
                        }`}>
                          {occupied} / {capacity} seats ({fillPercent}%)
                        </span>
                      </div>
                      <div className="w-full bg-hotstar-bg rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            fillPercent > 75 ? 'bg-emerald-400' :
                            fillPercent > 30 ? 'bg-yellow-400' : 'bg-gray-500'
                          }`}
                          style={{ width: `${Math.min(fillPercent, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {showtimes.length === 0 && (
                <div className="col-span-2 text-center py-6 text-xs text-gray-500">
                  No showtimes scheduled. Click "Manage Showtimes" to add some!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Recent Bookings Feed */}
        <div className="space-y-6">
          <div className="p-6 bg-hotstar-card rounded-xl border border-gray-800 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white tracking-tight uppercase text-gray-400">
                  Recent Bookings Feed
                </h3>
                <button
                  onClick={() => onNavigateToView('bookings')}
                  className="text-xs text-hotstar-accent hover:underline flex items-center space-x-1"
                >
                  <span>View all</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
                {bookings.slice(0, 5).map((booking) => {
                  const showtime = showtimes.find(st => st.id === booking.showtimeId);
                  const movie = showtime ? movies.find(m => m.id === showtime.movieId) : null;
                  
                  return (
                    <div
                      key={booking.id}
                      className="p-3 rounded-lg bg-hotstar-card-light/20 hover:bg-hotstar-card-light/40 border border-gray-800/60 transition-all flex items-start space-x-3"
                    >
                      <div className={`p-2 rounded-lg shrink-0 ${
                        booking.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        <DollarSign size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-white truncate">{booking.customerName}</p>
                          <span className="text-[10px] font-mono text-gray-400">
                            ${booking.totalPrice.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 truncate mt-0.5">
                          {movie ? movie.title : 'Deleted Movie'} • {booking.seatsBooked.join(', ')}
                        </p>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[9px] text-gray-500 font-mono">
                            {new Date(booking.bookingTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                          <span className={`text-[8px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${
                            booking.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {bookings.length === 0 && (
                  <div className="text-center py-12 text-xs text-gray-500">
                    No bookings logged yet. Create some showtimes first!
                  </div>
                )}
              </div>
            </div>

            {/* Quick Helper Tip */}
            <div className="mt-6 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10 flex items-start space-x-2 text-[11px] text-gray-400">
              <AlertTriangle className="text-hotstar-gold shrink-0 mt-0.5" size={14} />
              <p>
                <span className="font-semibold text-white">Database integrity:</span> When deleting movies, ensure you handle cascading deletes for associated showtimes and bookings to prevent SQL query failures.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Backend Blueprint for Dashboard */}
      <BackendBlueprint scope="dashboard" />
    </div>
  );
}