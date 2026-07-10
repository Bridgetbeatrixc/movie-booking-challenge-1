import axios from 'axios';

axios.defaults.withCredentials = true;
const API_URL = '/api/auth';

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const registerUser = async (name, email, password) => {
  const response = await axios.post(`${API_URL}/register`, { name, email, password });
  return response.data;
};

export const logoutUser = async () => {
  const response = await axios.post(`${API_URL}/logout`);
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await axios.get(`${API_URL}/me`);
  return response.data;
};