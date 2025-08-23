"use client";

import { useEffect, useState } from "react";
import Layout from "@/Layout";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Boxes, Layers, PhoneCall } from "lucide-react";
import { fetchCategories } from "@/api/categoryApi";
import { fetchProducts } from "@/api/productApi";
import { fetchUsers } from "@/api/userApi";
// import type { Category, Product } from "@/types/type";
import type { Category, Product, User } from "@/types/Api";

export default function Statistique() {
  // 🗄️ State management
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 📡 Fetch initial data (products, categories, users)
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, categoriesRes, usersRes] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
          fetchUsers(),
        ]);
        setProducts(productsRes.data); // 👈 tableau réel
        setCategories(categoriesRes.data); // 👈 tableau réel
        setUsers(usersRes.data); // 👈 déjà correct
      } catch (error) {
        console.error("Error loading data:", error);
        setErrorMessage("Failed to load statistics data.");
      }
    };
    loadData();
  }, []);
  console.log("users", users, "categories", categories, "products", products);
  // 🕒 Auto-dismiss error message after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // 📊 Statistic cards data
  const statCards = [
    {
      title: "Employés",
      value: users.length,
      icon: <Users className="w-6 h-6 text-blue-500" />,
    },
    {
      title: "Produits",
      value: products.length,
      icon: <Boxes className="w-6 h-6 text-purple-500" />,
    },
    {
      title: "Catégories",
      value: categories.length,
      icon: <Layers className="w-6 h-6 text-orange-500" />,
    },
    {
      title: "Contacts",
      value: 0, // 📝 Placeholder for dynamic value
      icon: <PhoneCall className="w-6 h-6 text-pink-500" />,
    },
  ];

  return (
    <Layout>
      {/* 🔔 Error message */}
      {errorMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded shadow z-50">
          {errorMessage}
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* 👋 Welcome banner */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome 👋, Admin</h1>
            <p className="text-muted-foreground">
              Overview of your application statistics.
            </p>
          </div>
          <Avatar>
            <AvatarImage src="/admin-avatar.png" alt="Admin" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>

        {/* 📊 Statistic cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card
              key={stat.title}
              className="transition-transform hover:scale-105 cursor-pointer"
            >
              <CardHeader className="flex items-center justify-between">
                <span className="font-medium">{stat.title}</span>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
