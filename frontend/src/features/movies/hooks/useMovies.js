import { useEffect, useState } from "react";
import { getMovies } from "../api/movieApi.js";

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
  const [movies, setMovies] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    genre: "",
    status: "",
    sort: "status",
    page: 1,
    limit: 8
  });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedFilters(filters);
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [filters]);

  useEffect(() => {
    let active = true;

    async function loadMovies() {
      setLoading(true);
      setError("");

      try {
        const response = await getMovies(debouncedFilters);
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
          setMovies([]);
          setPagination({
            page: 1,
            limit: filters.limit,
            total: 0,
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
  }, [debouncedFilters]);

  function updateFilters(nextFilters) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      ...nextFilters,
      page: nextFilters.page || 1
    }));
  }

  return { movies, loading, error, filters, pagination, setFilters: updateFilters };
}
