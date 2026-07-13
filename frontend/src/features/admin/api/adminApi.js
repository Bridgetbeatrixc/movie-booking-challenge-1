import { apiRequest } from "../../../services/apiClient.js";

export function getAdminStats() {
  return apiRequest("/api/admin/stats");
}

export function getAdminBookings() {
  return apiRequest("/api/admin/bookings");
}
