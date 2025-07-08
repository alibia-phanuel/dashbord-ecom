"use client";

import Layout from "@/Layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { useFormik } from "formik";
import { z } from "zod";

// 🛡️ Schéma Zod pour valider les produits
const productSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(1000, "La description ne peut pas dépasser 1000 caractères"),
  price: z
    .number()
    .min(0.01, "Le prix doit être supérieur à 0")
    .max(100000, "Le prix ne peut pas dépasser 100000"),
});

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
};

// 🔥 Fonction pour valider avec Zod
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateWithZod = (schema: z.ZodSchema) => (values: any) => {
  try {
    schema.parse(values);
    return {};
  } catch (error) {
    const errors: Record<string, string> = {};
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        const field = err.path[0] as string;
        errors[field] = err.message;
      });
    }
    return errors;
  }
};

export default function Produits() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "iPhone 15 Pro",
      description: "Le dernier iPhone avec puce A17 Bionic.",
      price: 1250,
    },
    {
      id: 2,
      name: "MacBook Air M2",
      description: "Puissance et légèreté pour vos besoins professionnels.",
      price: 1600,
    },
  ]);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formik = useFormik({
    initialValues: { name: "", description: "", price: 0 },
    validate: validateWithZod(productSchema),
    onSubmit: (values, { resetForm }) => {
      if (editProduct) {
        // Modifier le produit
        setProducts((prev) =>
          prev.map((p) => (p.id === editProduct.id ? { ...p, ...values } : p))
        );
      } else {
        // Ajouter un nouveau produit
        const newProduct: Product = {
          id: Date.now(),
          name: values.name,
          description: values.description,
          price: values.price,
        };
        setProducts((prev) => [...prev, newProduct]);
      }
      resetForm();
      setEditProduct(null);
      setIsDialogOpen(false);
    },
  });

  const openAddModal = () => {
    formik.resetForm();
    setEditProduct(null);
    setIsDialogOpen(true);
  };

  const openEditModal = (product: Product) => {
    formik.setValues(product);
    setEditProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <Layout>
      <div
        className="flex flex-col items-center justify-start w-full space-y-4 p-4"
        style={{ height: "calc(100vh - 32px)" }}
      >
        <div className="flex justify-between w-full">
          <h2 className="text-3xl font-semibold">Produits</h2>
          {/* ➕ Ajouter bouton */}
          <Button onClick={openAddModal} className="flex items-center gap-2">
            <Plus size={18} /> Ajouter
          </Button>
        </div>

        {/* 📋 Liste des produits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {products.map((product) => (
            <Card key={product.id} className="relative">
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-2">{product.description}</p>
                <p className="font-bold text-green-600">{product.price} €</p>
              </CardContent>
              <div className="absolute top-2 right-2 flex space-x-2">
                {/* 📝 Modifier */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openEditModal(product)}
                >
                  <Pencil size={16} />
                </Button>
                {/* 🗑️ Supprimer */}
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ✅ Modal pour ajouter/modifier */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editProduct ? "Modifier Produit" : "Nouveau Produit"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <Input
                id="name"
                name="name"
                placeholder="Nom du produit"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.name}
                </p>
              )}
            </div>
            <div>
              <Textarea
                id="description"
                name="description"
                placeholder="Description du produit"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={3}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.description}
                </p>
              )}
            </div>
            <div>
              <Input
                id="price"
                name="price"
                placeholder="Prix (€)"
                type="number"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.price && formik.errors.price && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.price}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button type="submit">
                {editProduct ? "Enregistrer les modifications" : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
