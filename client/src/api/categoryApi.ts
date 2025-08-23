import axiosInstance from "./axiosInstance";
import type { CategoriesResponse, CategoryResponse } from "@/types/Api";

// 🟢 Fetch all categories
export const fetchCategories = async (): Promise<CategoriesResponse> => {
  try {
    const response = await axiosInstance.get("/categories/getAllCategories");
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch categories.");
  }
};

// 🔵 Fetch category by ID
export const fetchCategoryById = async (
  id: number
): Promise<CategoryResponse> => {
  try {
    const response = await axiosInstance.get(
      `/categories/getCategoryById/${id}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch category with ID ${id}.`);
  }
};

// 🟡 Create a category
export const createCategory = async (data: {
  name: string;
}): Promise<CategoryResponse> => {
  try {
    const response = await axiosInstance.post("/categories/create", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create category.");
  }
};

// 🟠 Update a category
export const updateCategory = async (
  id: number,
  data: { name: string }
): Promise<CategoryResponse> => {
  try {
    const response = await axiosInstance.put(`/categories/update/${id}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to update category with ID ${id}.`);
  }
};

// 🔴 Delete a category
export const deleteCategory = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/categories/delete/${id}`);
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to delete category with ID ${id}.`);
  }
};
