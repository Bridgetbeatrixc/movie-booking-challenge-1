import { apiRequest } from "../../../services/apiClient.js";

export function getMovies() {
  return apiRequest("/api/movies");
}
