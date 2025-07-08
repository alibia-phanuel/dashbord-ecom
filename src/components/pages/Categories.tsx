/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { useFormik } from "formik";
import { z } from "zod";

// 🛡️ Schéma Zod pour valider les catégories
const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
});

type Category = {
  id: number;
  name: string;
};

// 🔥 Fonction pour valider avec Zod
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

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Smartphones" },
    { id: 2, name: "Ordinateurs" },
    { id: 3, name: "Accessoires" },
  ]);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formik = useFormik({
    initialValues: { name: "" },
    validate: validateWithZod(categorySchema),
    onSubmit: (values, { resetForm }) => {
      if (editCategory) {
        // Modifier la catégorie
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === editCategory.id ? { ...cat, name: values.name } : cat
          )
        );
      } else {
        // Ajouter une nouvelle catégorie
        const newCategory: Category = {
          id: Date.now(),
          name: values.name,
        };
        setCategories((prev) => [...prev, newCategory]);
      }
      resetForm();
      setEditCategory(null);
      setIsDialogOpen(false);
    },
  });

  const openAddModal = () => {
    formik.resetForm();
    setEditCategory(null);
    setIsDialogOpen(true);
  };

  const openEditModal = (category: Category) => {
    formik.setValues({ name: category.name });
    setEditCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  return (
    <Layout>
      <div
        className="flex flex-col items-center justify-start w-full space-y-4 p-4"
        style={{ height: "calc(100vh - 32px)" }}
      >
        <div className="flex justify-between w-full">
          <h2 className="text-3xl font-semibold">Catégories</h2>
          {/* ➕ Ajouter bouton */}
          <Button onClick={openAddModal} className="flex items-center gap-2">
            <Plus size={18} /> Ajouter
          </Button>
        </div>

        {/* 📋 Liste des catégories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {categories.map((cat) => (
            <Card key={cat.id} className="relative">
              <CardHeader>
                <CardTitle className="text-lg">{cat.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Gérez vos produits dans cette catégorie.
                </p>
              </CardContent>
              <div className="absolute top-2 right-2 flex space-x-2">
                {/* 📝 Modifier */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openEditModal(cat)}
                >
                  <Pencil size={16} />
                </Button>
                {/* 🗑️ Supprimer */}
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(cat.id)}
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
              {editCategory ? "Modifier Catégorie" : "Nouvelle Catégorie"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <Input
                id="name"
                name="name"
                placeholder="Nom de la catégorie"
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
            <DialogFooter>
              <Button type="submit">
                {editCategory ? "Enregistrer les modifications" : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
