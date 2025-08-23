import axiosInstance from "./axiosInstance";
import type { ProductsResponse, ProductResponse } from "@/types/Api";

// 🟢 Fetch all products
export const fetchProducts = async (): Promise<ProductsResponse> => {
  try {
    const response = await axiosInstance.get("/products/getAllProducts");
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch products.");
  }
};

// 🔵 Fetch product by ID
export const fetchProductById = async (
  id: number
): Promise<ProductResponse> => {
  try {
    const response = await axiosInstance.get(`/products/getProductById/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch product with ID ${id}.`);
  }
};

// 🟡 Create a product
export const createProduct = async (data: {
  name: string;
  description: string;
  price: number;
  stock?: number;
  categoryId?: number;
}): Promise<ProductResponse> => {
  try {
    const response = await axiosInstance.post("/products/create", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create product.");
  }
};

// 🟠 Update a product
export const updateProduct = async (
  id: number,
  data: {
    name: string;
    description: string;
    price: number;
    stock?: number;
    categoryId?: number;
  }
): Promise<ProductResponse> => {
  try {
    const response = await axiosInstance.put(`/products/update/${id}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to update product with ID ${id}.`);
  }
};

// 🔴 Delete a product
export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/products/delete/${id}`);
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to delete product with ID ${id}.`);
  }
};
