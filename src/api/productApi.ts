import axios from "axios";

const BASE_URL = "http://localhost:5000/api/products";

export const fetchProducts = () => axios.get(`${BASE_URL}/getAllProducts`);
export const createProduct = (data: {
  name: string;
  description: string;
  price: number;
  stock?: number;
  categoryId?: number;
}) => axios.post(`${BASE_URL}/create`, data);
export const fetchProductById = (id: number) =>
  axios.get(`${BASE_URL}/getProductById/${id}`);
export const updateProduct = (
  id: number,
  data: {
    name: string;
    description: string;
    price: number;
    stock?: number;
    categoryId?: number;
  }
) => axios.put(`${BASE_URL}/update/${id}`, data);
export const deleteProduct = (id: number) =>
  axios.delete(`${BASE_URL}/delete/${id}`);
