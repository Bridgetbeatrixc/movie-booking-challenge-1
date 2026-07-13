import { apiRequest } from "../../../services/apiClient.js";

export function getMyBookings() {
  return apiRequest("/api/bookings/me");
}

export function cancelBooking(bookingId) {
  return apiRequest(`/api/bookings/${bookingId}`, { method: "DELETE" });
}
