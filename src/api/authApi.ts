import axios from "axios";

const BASE_URL = "http://localhost:5000/api/auth";

// 🟢 Authentifier un utilisateur
export const loginUser = (data: { email: string; password: string }) =>
  axios.post(`${BASE_URL}/login`, data);


// Recuperer l'utilisateur connecté
export const getCurrentUser = (token: string) =>
  axios.get(`${BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// 🟡 Déconnexion de l'utilisateur
export const logoutUser = (token: string) =>
  axios.post(`${BASE_URL}/logout`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });