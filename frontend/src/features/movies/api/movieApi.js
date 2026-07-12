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
