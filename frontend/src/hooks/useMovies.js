import { useEffect, useState } from "react";
import { movies as fallbackMovies } from "../data/movies";
import { getMovies } from "../services/api";

function normalizeMovie(movie) {
  return {
    ...movie,
    id: movie._id || movie.id,
    genres: Array.isArray(movie.genres) ? movie.genres.join(" / ") : movie.genres,
    rating: String(movie.rating),
    year: String(movie.year),
    price: movie.price || 35000
  };
}

export function useMovies() {
  const [movies, setMovies] = useState(fallbackMovies);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadMovies() {
      setLoading(true);
      setError("");

      try {
        const apiMovies = await getMovies();

        if (active && apiMovies.length) {
          setMovies(apiMovies.map(normalizeMovie));
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message);
          setMovies(fallbackMovies);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      active = false;
    };
  }, []);

  return { movies, loading, error };
}
