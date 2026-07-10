import { useEffect, useState } from "react";
import { defaultMovie, movies } from "../features/movies/data/movies.js";
import { HomePage } from "../features/movies/pages/HomePage.jsx";
import { SeatSelectionPage } from "../features/showtimes/pages/SeatSelectionPage.jsx";

export default function App() {
  const [page, setPage] = useState(() => (window.location.hash === "#booking" ? "booking" : "home"));
  const [selectedMovie, setSelectedMovie] = useState(() => {
    const saved = localStorage.getItem("selectedMovie");
    return movies.find((movie) => movie.key === saved || movie.title === saved) || defaultMovie;
  });

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash;
      setPage(hash === "#booking" ? "booking" : "home");

      if (hash === "#booking" || hash === "#" || hash === "") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  function chooseMovie(movie) {
    setSelectedMovie(movie);
    localStorage.setItem("selectedMovie", movie.key);
  }

  return page === "booking" ? (
    <SeatSelectionPage selectedMovie={selectedMovie} setSelectedMovie={chooseMovie} />
  ) : (
    <HomePage selectedMovie={selectedMovie} setSelectedMovie={chooseMovie} />
  );
}

