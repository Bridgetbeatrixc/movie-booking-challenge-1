
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "";
const objectIdPattern = /^[a-f\d]{24}$/i;

function isObjectId(value) {
  return objectIdPattern.test(String(value || ""));
}

async function requestJson(path, options = {}) {
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
    throw new Error(errorBody.message || "Request failed.");
  }

  return response.json();
}

function normalizeShowtime(showtime, movieKey) {
  return {
    id: showtime.id || showtime._id,
    movieId: showtime.movieId || showtime.movie?._id || showtime.movie,
    movieKey: showtime.movieKey || movieKey,
    date: showtime.date,
    time: showtime.time,
    studio: showtime.studio,
    price: showtime.price,
    bookedSeats: showtime.bookedSeats || []
  };
}

export async function fetchShowtimesForMovie(movie) {
  const movieId = movie?._id || movie?.id;

  if (!isObjectId(movieId)) throw new Error("A valid movie must be selected.");
  const showtimes = await requestJson(`/api/movies/${movieId}/showtimes`);
  return showtimes.map((showtime) => normalizeShowtime(showtime, movieId));
}

export async function fetchSeatAvailability(showtime) {
  if (!isObjectId(showtime?.id)) throw new Error("A valid showtime must be selected.");
  return requestJson(`/api/showtimes/${showtime.id}/seats`);
}

export function getShowtimes(params = {}) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, value);
    }
  });

  return requestJson(`/api/showtimes${search.toString() ? `?${search.toString()}` : ""}`);
}

export function createShowtime(showtimeData) {
  return requestJson(`/api/showtimes`, {
    method: "POST",
    body: JSON.stringify(showtimeData)
  });
}

export function updateShowtime(showtimeId, showtimeData) {
  return requestJson(`/api/showtimes/${showtimeId}`, {
    method: "PUT",
    body: JSON.stringify(showtimeData)
  });
}

export function deleteShowtime(showtimeId) {
  return requestJson(`/api/showtimes/${showtimeId}`, {
    method: "DELETE"
  });
}
