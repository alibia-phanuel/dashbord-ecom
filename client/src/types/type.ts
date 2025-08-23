import type { JSX } from "react";

// 📋 Product interface
// src/types/Api.ts
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock?: number;
  categoryId?: number;
  category?: { name: string };
  images?: { id: number; imageUrl: string }[];
  createdAt: string | number | Date; // Ajoutez ce champ
}
export type Category = {
  id: number;
  name: string;
};
// 📋 User interface
export interface User {
  id: string;
  uuid: string;
  name: string;
  email: string;
  role: "admin" | "employe" | "client";
}

// 📝 User form values interface
export interface UserFormValues {
  name: string;
  email: string;
  password: string;
  role: "admin" | "employe" | "client";
}
// 📋 Interface for statistic card
export interface StatCard {
  title: string;
  value: number;
  icon: JSX.Element;
}
export type LayoutProps = {
  children: React.ReactNode;
};
