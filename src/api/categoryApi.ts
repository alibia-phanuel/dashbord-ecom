import axios from "axios";

const BASE_URL = "http://localhost:5000/api/categories";

export const fetchCategories = () => axios.get(`${BASE_URL}/getAllCategories`);

export const fetchCategoryById = (id: number) =>
  axios.get(`${BASE_URL}/getCategoryById/${id}`);
export const createCategory = (data: { name: string }) =>
  axios.post(`${BASE_URL}/create`, data);
export const updateCategory = (id: number, data: { name: string }) =>
  axios.put(`${BASE_URL}/update/${id}`, data);
export const deleteCategory = (id: number) =>
  axios.delete(`${BASE_URL}/delete/${id}`);
