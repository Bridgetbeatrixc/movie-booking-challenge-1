const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "API request failed");
  }

  return data;
}

export function getMovies() {
  return request("/api/movies");
}

export function checkoutBooking(payload) {
  return request("/api/bookings/checkout", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function markBookingPaid(bookingId) {
  return request(`/api/bookings/${bookingId}/mock-paid`, {
    method: "PATCH"
  });
}
