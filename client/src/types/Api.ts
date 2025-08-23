// 📋 Type definitions for API data structures

// User-related types

export interface ProductsResponse {
  data: Product[];
}

export interface ProductResponse {
  data: Product;
}

// Product-related types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock?: number;
  categoryId?: number;
  category?: {
    name: string;
  };
  images?: ProductImage[];
  createdAt: string | number | Date; // Ajoutez ce champ
}

export interface ProductImage {
  id: number;
  imageUrl: string;
}

export interface ProductImagesResponse {
  data: ProductImage[];
}
export interface User {
  uuid: string;
  name: string;
  email: string;
  role: "admin" | "employe" | "client";
  profilePicture?: string;
}

export interface UsersResponse {
  data: User[];
}

export interface UserResponse {
  data: User;
}

// Category-related types
export interface Category {
  id: number;
  name: string;
}

export interface CategoriesResponse {
  data: Category[];
}

export interface CategoryResponse {
  data: Category;
}

// Auth-related types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface CurrentUserResponse {
  user: User;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

// Exemple du type User
export interface User {
  id: string;
  uuid: string;
  name: string;
  email: string;
  role: "admin" | "employe" | "client";
  profilePicture?: string;
}
