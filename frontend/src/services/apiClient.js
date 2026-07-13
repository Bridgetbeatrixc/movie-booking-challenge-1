export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "";

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const error = new Error(errorBody.message || "Request failed.");
    error.status = response.status;
    error.unavailableSeats = errorBody.unavailableSeats || [];
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
