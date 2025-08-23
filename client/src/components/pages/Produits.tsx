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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Pencil, Plus } from "lucide-react";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/api/productApi";
import { fetchCategories } from "@/api/categoryApi";
import { uploadImages, getImages, deleteImage } from "@/api/productImageApi";
import type { Product } from "@/types/type";

// 🛡️ Schéma Zod pour la validation des produits
const productSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(10000, "La description ne peut pas dépasser 10000 caractères"),
  price: z
    .number()
    .min(0.01, "Le prix doit être supérieur à 0")
    .max(1000000000000, "Le prix ne peut pas dépasser 1000000000000"),
  stock: z
    .number()
    .min(0, "Le stock ne peut pas être négatif")
    .max(100000, "Le stock ne peut pas dépasser 100 000"),
  categoryId: z
    .number({ invalid_type_error: "Une catégorie est requise" })
    .min(1, "Une catégorie est requise"),
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

export default function Produits() {
  // 🗄️ Gestion de l'état
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [existingImages, setExistingImages] = useState<
    { id: number; imageUrl: string }[]
  >([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviewImages, setNewPreviewImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 📡 Chargement des données initiales
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);
        // Trier les produits par date de création (ou par id si createdAt est absent)
        const sortedProducts = productsRes.data.sort((a: Product, b: Product) =>
          a.createdAt && b.createdAt
            ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            : b.id - a.id
        );
        setProducts(sortedProducts);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
        setErrorMessage("Échec du chargement des produits ou des catégories.");
      }
    };
    loadData();
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

  // 📝 Configuration de Formik pour le formulaire de produit
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      categoryId: 0,
    },
    validate: validateWithZod(productSchema),
    onSubmit: async (values, { resetForm }) => {
      const totalImages = existingImages.length + newImages.length;
      if (totalImages === 0) {
        setImageError("Au moins une image est requise.");
        return;
      }
      if (totalImages > 5) {
        setImageError("Maximum 5 images autorisées.");
        return;
      }

      setIsLoading(true);
      try {
        let updatedProduct: Product;
        if (editProduct) {
          // 🔄 Mise à jour d'un produit existant
          const res = await updateProduct(editProduct.id, values);
          await Promise.all(
            imagesToDelete.map((id) => deleteImage(editProduct.id, id))
          );
          if (newImages.length > 0) {
            await uploadImages(editProduct.id, newImages);
          }
          const imagesRes = await getImages(editProduct.id);
          updatedProduct = {
            ...res.data,
            images: imagesRes.data,
            createdAt: editProduct.createdAt || new Date().toISOString(), // Conserver ou définir une valeur par défaut
          };
          setProducts((prev) =>
            prev
              .map((p) => (p.id === editProduct.id ? updatedProduct : p))
              .sort((a, b) =>
                a.createdAt && b.createdAt
                  ? new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                  : b.id - a.id
              )
          );
        } else {
          // ➕ Création d'un nouveau produit
          const res = await createProduct(values);
          if (res.data?.id && newImages.length > 0) {
            await uploadImages(res.data.id, newImages);
            const imagesRes = await getImages(res.data.id);
            updatedProduct = {
              ...res.data,
              images: imagesRes.data,
              createdAt: res.data.createdAt || new Date().toISOString(), // Utiliser createdAt de l'API ou une valeur par défaut
            };
          } else {
            updatedProduct = {
              ...res.data,
              createdAt: res.data.createdAt || new Date().toISOString(),
            };
          }
          setProducts((prev) =>
            [...prev, updatedProduct].sort((a, b) =>
              a.createdAt && b.createdAt
                ? new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
                : b.id - a.id
            )
          );
        }

        // 🧹 Réinitialisation du formulaire et de l'état
        resetForm();
        setNewImages([]);
        newPreviewImages.forEach(URL.revokeObjectURL);
        setNewPreviewImages([]);
        setExistingImages([]);
        setEditProduct(null);
        setIsDialogOpen(false);
        setSuccessMessage(
          editProduct
            ? "Produit mis à jour avec succès."
            : "Produit ajouté avec succès."
        );
      } catch (error) {
        console.error("Erreur lors de l'enregistrement du produit :", error);
        setErrorMessage(
          "Une erreur s'est produite lors de l'enregistrement du produit."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  // ➕ Ouvrir la modale pour ajouter un nouveau produit
  const openAddModal = () => {
    formik.resetForm();
    setEditProduct(null);
    setExistingImages([]);
    setNewImages([]);
    newPreviewImages.forEach(URL.revokeObjectURL);
    setNewPreviewImages([]);
    setImageError("");
    setIsDialogOpen(true);
  };

  // 📝 Ouvrir la modale pour modifier un produit
  const openEditModal = async (product: Product) => {
    formik.setValues({
      ...product,
      price: Number(product.price),
      stock: Number(product.stock ?? 0),
      categoryId: Number(product.categoryId ?? 0),
    });
    setImageError("");
    setEditProduct(product);
    setIsDialogOpen(true);
    setImagesToDelete([]);
    try {
      const res = await getImages(product.id);
      setExistingImages(res.data);
      setNewImages([]);
      newPreviewImages.forEach(URL.revokeObjectURL);
      setNewPreviewImages([]);
    } catch (error) {
      console.error("Erreur lors du chargement des images du produit :", error);
      setErrorMessage("Échec du chargement des images du produit.");
    }
  };

  // 📸 Gestion de la sélection d'images
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = ""; // Réinitialiser l'input pour permettre la re-sélection des mêmes fichiers
    const totalImages = existingImages.length + newImages.length + files.length;

    if (files.length === 0) {
      setImageError("Au moins une image est requise.");
      return;
    }
    if (totalImages > 5) {
      setImageError("Maximum 5 images autorisées.");
      return;
    }

    setImageError("");
    const updatedNewImages = [...newImages, ...files];
    const updatedNewPreviews = [
      ...newPreviewImages,
      ...files.map((file) => URL.createObjectURL(file)),
    ];
    setNewImages(updatedNewImages);
    setNewPreviewImages(updatedNewPreviews);
  };

  // 🗑️ Supprimer un produit
  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setSuccessMessage("Produit supprimé avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression du produit :", error);
      setErrorMessage("Échec de la suppression du produit.");
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
          <h2 className="text-3xl font-semibold">Produits</h2>
          <Button onClick={openAddModal} className="flex items-center gap-2">
            <Plus size={18} /> Ajouter un produit
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
                <div className="flex space-x-2 overflow-x-auto mb-2">
                  {product.images?.map((img) => (
                    <img
                      key={img.id}
                      src={`${import.meta.env.VITE_API_BASE_URL_IMG}/Uploads/${
                        img.imageUrl
                      }`}
                      alt={product.name}
                      className="w-18 h-18 object-contain rounded border"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-2">{product.description}</p>
                <p className="font-bold text-green-600">{product.price} FCFA</p>
                <p className="font-bold text-blue-500">
                  Stock : {product.stock}
                </p>
                <p className="text-sm text-gray-500 italic">
                  Catégorie : {product.category?.name || "Aucune"}
                </p>
              </CardContent>
              <div className="absolute top-2 right-2 flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openEditModal(product)}
                >
                  <Pencil size={16} />
                </Button>
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

      {/* ✅ Modale pour ajouter/modifier un produit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editProduct ? "Modifier le produit" : "Nouveau produit"}
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
            <div>
              <Input
                id="stock"
                name="stock"
                placeholder="Quantité en stock"
                type="number"
                value={formik.values.stock}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.stock && formik.errors.stock && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.stock}
                </p>
              )}
            </div>
            <div>
              <select
                id="categoryId"
                name="categoryId"
                value={formik.values.categoryId}
                onChange={(e) =>
                  formik.setFieldValue("categoryId", Number(e.target.value))
                }
                onBlur={formik.handleBlur}
                className="w-full border rounded p-2"
              >
                <option value={0}>-- Sélectionner une catégorie --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {formik.touched.categoryId && formik.errors.categoryId && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.categoryId}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Images (max. 5)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="block w-full"
              />
              {imageError && (
                <p className="text-red-500 text-sm mt-1">{imageError}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {existingImages.length + newImages.length}/5 images
                sélectionnées
              </p>
              <div className="flex gap-2 mt-2">
                {existingImages
                  .filter((img) => !imagesToDelete.includes(img.id))
                  .map((img, index) => (
                    <div key={img.id} className="relative">
                      <img
                        src={`http://localhost:5000/uploads/${img.imageUrl}`}
                        alt={`Image existante ${index + 1}`}
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setImagesToDelete((prev) => [...prev, img.id])
                        }
                        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
              </div>
              <div className="flex gap-2 mt-2">
                {newPreviewImages.map((src, index) => (
                  <div key={index} className="relative">
                    <img
                      src={src}
                      alt={`Aperçu ${index}`}
                      className="w-20 h-20 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updatedNewImages = [...newImages];
                        const updatedNewPreviews = [...newPreviewImages];
                        updatedNewImages.splice(index, 1);
                        updatedNewPreviews.splice(index, 1);
                        URL.revokeObjectURL(src);
                        setNewImages(updatedNewImages);
                        setNewPreviewImages(updatedNewPreviews);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  existingImages.filter(
                    (img) => !imagesToDelete.includes(img.id)
                  ).length +
                    newImages.length ===
                    0
                }
              >
                {isLoading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
