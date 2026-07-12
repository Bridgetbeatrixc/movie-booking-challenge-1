import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { asset } from "../../utils/assets.js";
import { useAuth } from "../../features/auth/AuthContext.jsx";

export function Header({ booking = false }) {
  return (
    <header
      className={
        booking
          ? "mx-auto flex max-w-6xl items-center justify-between px-6 py-5"
          : "absolute inset-x-0 top-0 z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6"
      }
    >
      <Link to="/">
        <img src={asset("beatrix-logo.png")} alt="Beatrix Movie" className="h-9" />
      </Link>

      {booking ? <BookingBackLink /> : <HomeNavigation />}
    </header>
  );
}

function BookingBackLink() {
  return (
    <Link to="/" className="text-sm text-slate-300 hover:text-white">
      Back to movies
    </Link>
  );
}

function HomeNavigation() {
  const { isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <nav className="hidden gap-7 text-sm text-slate-300 md:flex">
        <Link className="text-white" to="/">
          Home
        </Link>
        <Link to="/movies">Movies</Link>
        <a href="#coming-soon">Coming soon</a>
        
        {isAuthenticated ? (
          <>
            <Link to="/my-bookings">My Bookings</Link>
            {role === "admin" && <Link to="/admin">Admin</Link>}
            <button onClick={handleLogout} className="text-slate-300 hover:text-white bg-transparent border-none cursor-pointer">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        
        <a href="#footer">Contact</a>
      </nav>
      <Link to="/movies" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900">
        Book now
      </Link>
    </>
  );
}
