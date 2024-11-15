import axios from "axios";

const API_URL = "https://user-management-flax-three.vercel.app/api";

// Auth API
export const register = (userData) =>
  axios.post(`${API_URL}/auth/register`, userData);
export const login = (userData) =>
  axios.post(`${API_URL}/auth/login`, userData);

// User API
export const fetchUsers = (token) =>
  axios.get(`${API_URL}/users`, { headers: { Authorization: token } });
export const toggleBlockUser = (id, token) =>
  axios.patch(
    `${API_URL}/users/block/${id}`,
    {},
    { headers: { Authorization: token } }
  );
export const deleteUser = (id, token) =>
  axios.delete(`${API_URL}/users/deleteUser/${id}`, { headers: { Authorization: token } });

export const editUser = (id,updatedData ,token) =>
  axios.patch(
    `${API_URL}/users/edit/${id}`,
    {updatedData},
    { headers: { Authorization: token } }
  );
