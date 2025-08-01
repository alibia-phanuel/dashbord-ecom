// src/api/userApi.ts
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/users";

// 🟢 Récupérer tous les utilisateurs
export const fetchUsers = () => axios.get(`${BASE_URL}/getAllUsers`);

// 🔵 Récupérer un utilisateur par UUID
export const fetchUserById = (uuid: string) =>
  axios.get(`${BASE_URL}/getUser/${uuid}`);

// 🟡 Créer un utilisateur
export const createUser = (data: {
  name: string;
  email: string;
  password: string;
  role: "admin" | "employe" | "client";
}) => axios.post(`${BASE_URL}/create`, data);

// 🟠 Mettre à jour un utilisateur (par UUID)
export const updateUser = (
  uuid: string,
  data: {
    name?: string;
    email?: string;
    password?: string;
    role?: "admin" | "employe" | "client";
    profilePicture?: string;
  }
) => axios.patch(`${BASE_URL}/update/${uuid}`, data);

// 🔴 Supprimer un utilisateur
export const deleteUser = (uuid: string) =>
  axios.delete(`${BASE_URL}/delete/${uuid}`);
