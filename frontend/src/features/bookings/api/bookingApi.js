import { API_BASE_URL, apiRequest } from "../../../services/apiClient.js";

export function checkoutBooking(payload) {
  return apiRequest("/api/bookings/checkout", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getOccupiedSeats(params) {
  const search = new URLSearchParams(params);
  return apiRequest(`/api/bookings/occupied?${search.toString()}`);
}

export function getBookings(params = {}) {
  const search = new URLSearchParams(params);
  return apiRequest(`/api/bookings${search.toString() ? `?${search.toString()}` : ""}`);
}

export function markBookingPaid(bookingId) {
  return apiRequest(`/api/bookings/${bookingId}/mock-paid`, {
    method: "PATCH"
  });
}

export function sendTicketEmail(bookingId, email) {
  return apiRequest(`/api/bookings/${bookingId}/email`, {
    method: "POST",
    body: JSON.stringify({ email })
  });
}

export function getTicketPdfUrl(bookingId) {
  return `${API_BASE_URL}/api/bookings/${bookingId}/ticket.pdf`;
}
