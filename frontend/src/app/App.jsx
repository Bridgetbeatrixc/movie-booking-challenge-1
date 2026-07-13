import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { defaultMovie, getMovieKey } from "../features/movies/data/movies.js";
import { useMovies } from "../features/movies/hooks/useMovies.js";
import { useHashRoute } from "../hooks/useHashRoute.js";
import { AdminPage } from "../pages/AdminPage.jsx";
import { HomePage } from "../pages/HomePage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import AdminLoginPage from "../pages/AdminLoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import { MovieDetailPage } from "../pages/MovieDetailPage.jsx";
import { PaymentPage } from "../pages/PaymentPage.jsx";
import { SeatSelectionPage } from "../pages/SeatSelectionPage.jsx";

function getInitialMovie(movies) {
  const savedMovie = localStorage.getItem("selectedMovie");
  return movies.find((movie) => getMovieKey(movie) === savedMovie || movie.title === savedMovie) || defaultMovie;
}

export default function App() {
  const location = useLocation();
  const route = useHashRoute();
  const { filters, movies, loading, error, pagination, setFilters } = useMovies();
  const [selectedMovie, setSelectedMovie] = useState(() => getInitialMovie(movies));

  useEffect(() => {
    setSelectedMovie((currentMovie) => movies.find((movie) => movie.title === currentMovie.title) || currentMovie);
  }, [movies]);

  function chooseMovie(movie) {
    setSelectedMovie(movie);
    localStorage.setItem("selectedMovie", getMovieKey(movie) || movie.title);
  }

  const hashPath = location.hash ? location.hash.replace(/^#/, '') : '';

  if (location.pathname === "/login" || hashPath === "/login" || hashPath === "login") {
    return <LoginPage />;
  }

  if (location.pathname === "/admin-login" || hashPath === "/admin-login" || hashPath === "admin-login") {
    return <AdminLoginPage />;
  }

  if (location.pathname === "/register" || hashPath === "/register" || hashPath === "register") {
    return <RegisterPage />;
  }

  if (route === "booking") {
    return <SeatSelectionPage selectedMovie={selectedMovie} setSelectedMovie={chooseMovie} />;
  }

  if (route === "movie") {
    return <MovieDetailPage selectedMovie={selectedMovie} />;
  }

  if (route === "payment") {
    return <PaymentPage />;
  }

  if (route === "admin") {
    return <AdminPage movies={movies} moviesLoading={loading} onMovieCreated={() => setFilters({})} />;
  }

  return (
    <HomePage
      movies={movies}
      moviesError={error}
      moviesLoading={loading}
      movieFilters={filters}
      moviePagination={pagination}
      setMovieFilters={setFilters}
      selectedMovie={selectedMovie}
      setSelectedMovie={chooseMovie}
    />
  );
}
