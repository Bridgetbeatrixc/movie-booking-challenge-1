import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { defaultMovie, getMovieKey } from "../features/movies/data/movies.js";
import { useMovies } from "../features/movies/hooks/useMovies.js";
import { useHashRoute } from "../hooks/useHashRoute.js";
import { useAuth } from "../features/auth/AuthContext.jsx";
import { AdminPage } from "../pages/AdminPage.jsx";
import { HomePage } from "../pages/HomePage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import AdminLoginPage from "../pages/AdminLoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import { MovieDetailPage } from "../pages/MovieDetailPage.jsx";
import { PaymentPage } from "../pages/PaymentPage.jsx";
import { MyBookingsPage } from "../pages/MyBookingsPage.jsx";
import { SeatSelectionPage } from "../pages/SeatSelectionPage.jsx";

function getInitialMovie(movies) {
  const savedMovie = localStorage.getItem("selectedMovie");
  return movies.find((movie) => getMovieKey(movie) === savedMovie || movie.title === savedMovie) || defaultMovie;
}

function AdminOnly({ children }) {
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) return <div className="loading-state">Verifying admin authorization...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/" replace />;

  return children;
}

function AuthOnly({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="loading-state">Checking authentication credentials...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const location = useLocation();
  const route = useHashRoute();
  const { filters, genres, movies, loading, error, pagination, setFilters } = useMovies();
  const [selectedMovie, setSelectedMovie] = useState(() => getInitialMovie(movies));

  useEffect(() => {
    if (!movies.length) {
      return;
    }

    const savedMovie = localStorage.getItem("selectedMovie");

    setSelectedMovie((currentMovie) => {
      const currentMovieKey = getMovieKey(currentMovie);

      return (
        movies.find((movie) => getMovieKey(movie) === savedMovie || movie.title === savedMovie) ||
        movies.find((movie) => getMovieKey(movie) === currentMovieKey || movie.title === currentMovie.title) ||
        movies[0] ||
        currentMovie
      );
    });
  }, [movies]);

  function chooseMovie(movie) {
    setSelectedMovie(movie);
    localStorage.setItem("selectedMovie", getMovieKey(movie) || movie.title);
  }

  const hashPath = location.hash ? location.hash.replace(/^#/, '') : '';
  const movieRouteMatch = location.pathname.match(/^\/movie\/([^/]+)$/);
  const pathRoute = movieRouteMatch
    ? "movie"
    : { "/movie": "movie", "/movies": "home", "/booking": "booking", "/payment": "payment", "/admin": "admin", "/my-bookings": "my-bookings" }[location.pathname];
  const activeRoute = route === "home" ? pathRoute || "home" : route;
  const selectedMovieKey = movieRouteMatch ? decodeURIComponent(movieRouteMatch[1]) : getMovieKey(selectedMovie);

  if (location.pathname === "/login" || hashPath === "/login" || hashPath === "login") {
    return <LoginPage />;
  }

  if (location.pathname === "/admin-login" || hashPath === "/admin-login" || hashPath === "admin-login") {
    return <AdminLoginPage />;
  }

  if (location.pathname === "/register" || hashPath === "/register" || hashPath === "register") {
    return <RegisterPage />;
  }

  if (activeRoute === "booking") {
    return <SeatSelectionPage selectedMovie={selectedMovie} setSelectedMovie={chooseMovie} />;
  }

  if (activeRoute === "movie") {
    return <MovieDetailPage movieKey={selectedMovieKey} selectedMovie={selectedMovie} setSelectedMovie={chooseMovie} />;
  }

  if (activeRoute === "payment") {
    return <AuthOnly><PaymentPage /></AuthOnly>;
  }

  if (activeRoute === "my-bookings") {
    return <AuthOnly><MyBookingsPage /></AuthOnly>;
  }

  if (activeRoute === "admin") {
    return (
      <AdminOnly>
        <AdminPage movies={movies} moviesLoading={loading} onMovieCreated={() => setFilters({})} />
      </AdminOnly>
    );
  }

  return (
    <HomePage
      movies={movies}
      moviesError={error}
      movieGenres={genres}
      moviesLoading={loading}
      movieFilters={filters}
      moviePagination={pagination}
      setMovieFilters={setFilters}
      selectedMovie={selectedMovie}
      setSelectedMovie={chooseMovie}
    />
  );
}
