import { apiRequest } from "../../../services/apiClient.js";

export function getMovies(params = {}) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, value);
    }
  });

  return apiRequest(`/api/movies${search.toString() ? `?${search.toString()}` : ""}`);
}

export function getMovieById(movieIdOrSlug) {
  return apiRequest(`/api/movies/${encodeURIComponent(movieIdOrSlug)}`);
}

export function getMovieGenres() {
  return apiRequest("/api/movies/genres");
}

export function createMovie(movieData) {
  return apiRequest(`/api/movies`, {
    method: "POST",
    body: JSON.stringify(movieData)
  });
}

export function updateMovie(movieIdOrSlug, movieData) {
  return apiRequest(`/api/movies/${movieIdOrSlug}`, {
    method: "PUT",
    body: JSON.stringify(movieData)
  });
}

export function deleteMovie(movieIdOrSlug) {
  return apiRequest(`/api/movies/${movieIdOrSlug}`, {
    method: "DELETE"
  });
}
