import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { defaultMovie, getMovieKey } from "../features/movies/data/movies.js";
import { useMovies } from "../features/movies/hooks/useMovies.js";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import ProtectedRoute from "../features/auth/components/ProtectedRoute.jsx";
import AdminRoute from "../features/auth/components/AdminRoute.jsx";
import { AdminPage } from "../pages/AdminPage.jsx";
import { HomePage } from "../pages/HomePage.jsx";
import { MovieDetailPage } from "../pages/MovieDetailPage.jsx";
import { PaymentPage } from "../pages/PaymentPage.jsx";
import { SeatSelectionPage } from "../pages/SeatSelectionPage.jsx";

function getInitialMovie(movies) {
  const savedMovie = localStorage.getItem("selectedMovie");
  return movies.find((movie) => getMovieKey(movie) === savedMovie || movie.title === savedMovie) || defaultMovie;
}

export default function App() {
  const { filters, movies, loading, error, pagination, setFilters } = useMovies();
  const [selectedMovie, setSelectedMovie] = useState(() => getInitialMovie(movies));

  useEffect(() => {
    setSelectedMovie((currentMovie) => movies.find((movie) => movie.title === currentMovie.title) || currentMovie);
  }, [movies]);

  function chooseMovie(movie) {
    setSelectedMovie(movie);
    localStorage.setItem("selectedMovie", getMovieKey(movie) || movie.title);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
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
          }
        />

        <Route path="/movie" element={<MovieDetailPage selectedMovie={selectedMovie} />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/booking" element={<SeatSelectionPage selectedMovie={selectedMovie} setSelectedMovie={chooseMovie} />} />
          <Route path="/payment" element={<PaymentPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPage movies={movies} moviesLoading={loading} onMovieCreated={() => setFilters({})} />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
