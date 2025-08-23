"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { z } from "zod";
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
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/api/categoryApi";
import type { Category } from "@/types/type";

// 🛡️ Schéma Zod pour la validation des catégories
const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
});

// 🔥 Fonction de validation Zod
const validateWithZod = (schema: z.ZodSchema) => (values: unknown) => {
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
  // 🗄️ Gestion de l'état
  const [categories, setCategories] = useState<Category[]>([]);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 📡 Chargement des catégories au montage
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchCategories();
        setCategories(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories :", error);
        setErrorMessage("Échec du chargement des catégories.");
      }
    };
    loadCategories();
  }, []);

  // 🕒 Disparition automatique des messages après 5 secondes
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  // 📝 Configuration de Formik pour le formulaire de catégorie
  const formik = useFormik({
    initialValues: { name: "" },
    validate: validateWithZod(categorySchema),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editCategory) {
          // 🔄 Mise à jour d'une catégorie existante
          const res = await updateCategory(editCategory.id, values);
          setCategories((prev) =>
            prev.map((cat) => (cat.id === editCategory.id ? res.data : cat))
          );
          setSuccessMessage("Catégorie mise à jour avec succès.");
        } else {
          // ➕ Création d'une nouvelle catégorie
          const res = await createCategory(values);
          setCategories((prev) => [...prev, res.data]);
          setSuccessMessage("Catégorie ajoutée avec succès.");
        }
        resetForm();
        setEditCategory(null);
        setIsDialogOpen(false);
      } catch (error) {
        console.error(
          "Erreur lors de l'enregistrement de la catégorie :",
          error
        );
        setErrorMessage(
          "Une erreur s'est produite lors de l'enregistrement de la catégorie."
        );
      }
    },
  });

  // ➕ Ouvrir la modale pour ajouter une nouvelle catégorie
  const openAddModal = () => {
    formik.resetForm();
    setEditCategory(null);
    setIsDialogOpen(true);
  };

  // 📝 Ouvrir la modale pour modifier une catégorie
  const openEditModal = (category: Category) => {
    formik.setValues({ name: category.name });
    setEditCategory(category);
    setIsDialogOpen(true);
  };

  // 🗑️ Supprimer une catégorie
  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      setSuccessMessage("Catégorie supprimée avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression de la catégorie :", error);
      setErrorMessage("Échec de la suppression de la catégorie.");
    }
  };

  return (
    <Layout>
      {/* 🔔 Messages de succès et d'erreur */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow z-50">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded shadow z-50">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col items-center justify-start w-full space-y-4 p-4 h-[calc(100vh-32px)]">
        <div className="flex justify-between w-full">
          <h2 className="text-3xl font-semibold">Catégories</h2>
          <Button onClick={openAddModal} className="flex items-center gap-2">
            <Plus size={18} /> Ajouter une catégorie
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
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openEditModal(cat)}
                >
                  <Pencil size={16} />
                </Button>
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

      {/* ✅ Modale pour ajouter/modifier une catégorie */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
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
                {editCategory
                  ? "Enregistrer les modifications"
                  : "Ajouter la catégorie"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
