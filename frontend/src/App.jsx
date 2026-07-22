import { useEffect, useState } from "react";
import { getLocalStorageData, saveToLocalStorage } from './mockData';
import { defaultMovie, getMovieKey } from "./data/movies";
import { useHashRoute } from "./hooks/useHashRoute";
import { useMovies } from "./hooks/useMovies";
import { BookingPage } from "./pages/BookingPage";
import { HomePage } from "./pages/HomePage";
import { PaymentPage } from "./pages/PaymentPage";

//Admin Components
import AdminSidebar from './components/admin/AdminSidebar';
import DashboardView from './pages/admin/components/DashboardView';
import ManageMoviesView from './pages/admin/components/ManageMoviesView';
import ManageShowtimesView from './pages/admin/components/ManageShowtimesView';
import ViewBookingsView from './pages/admin/components/ViewBookingsView';

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
