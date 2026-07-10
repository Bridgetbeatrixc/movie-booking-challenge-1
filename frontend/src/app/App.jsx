import { useEffect, useState } from "react";
import { BookingPage } from "../features/bookings/pages/BookingPage.jsx";
import { PaymentPage } from "../features/bookings/pages/PaymentPage.jsx";
import { defaultMovie, getMovieKey } from "../features/movies/data/movies.js";
import { useMovies } from "../features/movies/hooks/useMovies.js";
import { HomePage } from "../features/movies/pages/HomePage.jsx";
import { useHashRoute } from "../shared/hooks/useHashRoute.js";

function getInitialMovie(movies) {
  const savedMovie = localStorage.getItem("selectedMovie");
  return movies.find((movie) => getMovieKey(movie) === savedMovie || movie.title === savedMovie) || defaultMovie;
}

export default function App() {
  const route = useHashRoute();
  const { movies, loading, error } = useMovies();
  const [selectedMovie, setSelectedMovie] = useState(() => getInitialMovie(movies));

  useEffect(() => {
    setSelectedMovie((currentMovie) => movies.find((movie) => movie.title === currentMovie.title) || currentMovie);
  }, [movies]);

  function chooseMovie(movie) {
    setSelectedMovie(movie);
    localStorage.setItem("selectedMovie", getMovieKey(movie) || movie.title);
  }

  if (route === "booking") {
    return <BookingPage selectedMovie={selectedMovie} setSelectedMovie={chooseMovie} />;
  }

  if (route === "payment") {
    return <PaymentPage />;
  }

  return (
    <HomePage
      movies={movies}
      moviesError={error}
      moviesLoading={loading}
      selectedMovie={selectedMovie}
      setSelectedMovie={chooseMovie}
    />
  );
}
