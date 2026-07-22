import React from 'react';
import { LayoutDashboard, Film, CalendarClock, Ticket, ShieldAlert, Award, Database, Terminal } from 'lucide-react';

export default function AdminSidebar({
  currentView,
  onViewChange,
  moviesCount,
  showtimesCount,
  bookingsCount
}) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'movies',
      label: 'Manage Movies',
      icon: Film,
      badge: moviesCount > 0 ? moviesCount.toString() : null
    },
    {
      id: 'showtimes',
      label: 'Manage Showtimes',
      icon: CalendarClock,
      badge: showtimesCount > 0 ? showtimesCount.toString() : null
    },
    {
      id: 'bookings',
      label: 'View Bookings',
      icon: Ticket,
      badge: bookingsCount > 0 ? bookingsCount.toString() : null
    }
  ];

  return (
    <aside id="admin-sidebar-nav" className="w-full lg:w-64 bg-hotstar-sidebar border-b lg:border-b-0 lg:border-r border-gray-800 flex flex-col justify-between shrink-0">
      {/* Brand & Logo */}
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-hotstar-accent to-blue-500 flex items-center justify-center text-white shadow-lg shadow-hotstar-accent/20">
            <Film size={22} className="animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-lg text-white tracking-tight flex items-center">
              Hotstar<span className="text-hotstar-accent font-light">Cine</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-hotstar-gold font-semibold font-mono block">
              Admin Console
            </span>
          </div>
        </div>

        {/* Hackathon Developer Badge */}
        <div className="mt-6 p-3 bg-hotstar-card/60 rounded-xl border border-hotstar-accent/10 flex items-center space-x-3">
          <div className="p-1.5 bg-hotstar-gold/10 rounded text-hotstar-gold">
            <Award size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-white truncate">Junior Dev Studio</p>
            <p className="text-[10px] text-gray-400 truncate">Hackathon Mode 🚀</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="px-4 py-2 space-y-1 flex-1">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-3 mb-2">
          Management
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-hotstar-accent/10 text-[#1f80e0] border border-hotstar-accent/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon size={18} className={isActive ? 'text-hotstar-accent' : 'text-gray-400'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-hotstar-accent text-white' : 'bg-hotstar-card-light text-gray-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Database/Storage Environment Status */}
      <div className="p-4 border-t border-gray-800 bg-hotstar-bg/30">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <Database size={13} className="text-emerald-400" />
            <span className="font-mono text-[10px]">LOCALSTORAGE SYNC</span>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-2.5 rounded-lg text-[11px]">
            <p className="font-semibold flex items-center mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1.5 inline-block"></span>
              State Preserved
            </p>
            <p className="text-gray-400 text-[10px] leading-relaxed">
              Adds, edits & deletions will persist on browser reload. Perfect for backend scaffolding!
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}