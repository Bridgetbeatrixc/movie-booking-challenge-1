import { apiRequest } from "../../../services/apiClient.js";

export function getHalls() {
  return apiRequest(`/api/halls`);
}

export function createHall(hallData) {
  return apiRequest(`/api/halls`, {
    method: "POST",
    body: JSON.stringify(hallData)
  });
}

export function updateHall(hallId, hallData) {
  return apiRequest(`/api/halls/${hallId}`, {
    method: "PUT",
    body: JSON.stringify(hallData)
  });
}

export function deleteHall(hallId) {
  return apiRequest(`/api/halls/${hallId}`, {
    method: "DELETE"
  });
}
