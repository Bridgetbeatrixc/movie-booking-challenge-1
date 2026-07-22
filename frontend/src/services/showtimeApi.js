import { getMovieKey } from "../data/movies.js";
import { buildLocalSeatAvailability, showtimeCatalog } from "../data/showtimes.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const objectIdPattern = /^[a-f\d]{24}$/i;

function isObjectId(value) {
  return objectIdPattern.test(String(value || ""));
}

async function requestJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);

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

function localShowtimesForMovie(movie) {
  const movieKey = getMovieKey(movie);

  return showtimeCatalog
    .filter((showtime) => showtime.movieKey === movieKey)
    .map((showtime) => normalizeShowtime(showtime, movieKey));
}

export async function fetchShowtimesForMovie(movie) {
  const movieId = movie?._id || movie?.id;

  if (isObjectId(movieId)) {
    try {
      const showtimes = await requestJson(`/api/movies/${movieId}/showtimes`);
      return showtimes.map((showtime) => normalizeShowtime(showtime, getMovieKey(movie)));
    } catch (error) {
      console.warn("Using local showtime fallback:", error.message);
    }
  }

  return localShowtimesForMovie(movie);
}

export async function fetchSeatAvailability(showtime) {
  if (isObjectId(showtime?.id)) {
    try {
      return requestJson(`/api/showtimes/${showtime.id}/seats`);
    } catch (error) {
      console.warn("Using local seat fallback:", error.message);
    }
  }

  return {
    showtimeId: showtime.id,
    movieId: showtime.movieId,
    bookedSeats: showtime.bookedSeats || [],
    availability: buildLocalSeatAvailability(showtime.bookedSeats || [])
  };
}
