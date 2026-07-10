import { useEffect, useState } from "react";
import { getMovies } from "../../../shared/api/api.js";
import { movies as fallbackMovies } from "../data/movies.js";

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
  const [filters, setFilters] = useState({
    search: "",
    genre: "",
    status: "",
    sort: "status",
    page: 1,
    limit: 8
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: fallbackMovies.length,
    totalPages: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadMovies() {
      setLoading(true);
      setError("");

      try {
        const response = await getMovies(filters);
        const apiMovies = Array.isArray(response) ? response : response.movies || [];

        if (active && apiMovies.length) {
          setMovies(apiMovies.map(normalizeMovie));
          setPagination(response.pagination || pagination);
        } else if (active) {
          setMovies([]);
          setPagination(response.pagination || { ...pagination, total: 0, totalPages: 1 });
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message);
          setMovies(fallbackMovies);
          setPagination({
            page: 1,
            limit: fallbackMovies.length,
            total: fallbackMovies.length,
            totalPages: 1
          });
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
  }, [filters]);

  function updateFilters(nextFilters) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      ...nextFilters,
      page: nextFilters.page || 1
    }));
  }

  return { movies, loading, error, filters, pagination, setFilters: updateFilters };
}
