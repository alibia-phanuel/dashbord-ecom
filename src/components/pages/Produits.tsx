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
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/api/productApi";
import { fetchCategories } from "@/api/categoryApi";
import { uploadImages, getImages, deleteImage } from "@/api/productImageApi";

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
  stock: z
    .number()
    .min(0, "Le stock doit être supérieur à 0")
    .max(100000, "Le stock ne peut pas dépasser 100000"),
  categoryId: z
    .number({ invalid_type_error: "Une catégorie est requise" })
    .min(1, "La catégorie est obligatoire"),
});

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock?: number;
  categoryId?: number;
  category?: {
    name: string;
  };
  images?: {
    id: number;
    imageUrl: string;
  }[];
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
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // Gestion des images : séparé existantes et nouvelles à uploader
  const [existingImages, setExistingImages] = useState<
    { id: number; imageUrl: string }[]
  >([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviewImages, setNewPreviewImages] = useState<string[]>([]);

  const [imageError, setImageError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // Gestion des messages d'erreur utilisateur
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDeleteImageId, setConfirmDeleteImageId] = useState<
    number | null
  >(null);

  useEffect(() => {
    fetchProducts().then((res) => setProducts(res.data));
    fetchCategories().then((res) => setCategories(res.data));
  }, []);
  // Masquer automatiquement les messages après 5 secondes
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 5000);

      // Nettoyage en cas de changement avant les 5s
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  // Charge les produits au montage
  // useEffect(() => {
  //   const load = async () => {
  //     try {
  //       const res = await fetchProducts();
  //       setProducts(res.data);
  //     } catch (error) {
  //       console.error("Erreur chargement produits", error);
  //       setErrorMessage("Erreur lors du chargement des produits.");
  //     }
  //   };
  //   load();
  // }, []);
  // Charge les catégories au montage
  // useEffect(() => {
  //   const load = async () => {
  //     try {
  //       const res = await fetchCategories();
  //       setCategories(res.data);
  //     } catch (error) {
  //       console.error("Erreur chargement catégories", error);
  //       setErrorMessage("Erreur lors du chargement des catégories.");
  //     }
  //   };
  //   load();
  // }, []);

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
      // Validation images
      if (existingImages.length + newImages.length === 0) {
        setImageError("Au moins une image est obligatoire.");
        return;
      }
      if (existingImages.length + newImages.length > 5) {
        setImageError("Maximum 5 images autorisées.");
        return;
      }
      setIsLoading(true);
      try {
        if (editProduct) {
          const res = await updateProduct(editProduct.id, values);

          // Supprimer les images marquées à supprimer
          await Promise.all(
            imagesToDelete.map((id) => deleteImage(editProduct.id, id))
          );

          // Si on a des images sélectionnées, on les upload après la mise à jour
          if (newImages.length > 0) {
            await uploadImages(editProduct.id, newImages);
          }
          // 🔄 Recharger les images depuis le backend
          const imagesRes = await getImages(editProduct.id);
          setExistingImages(imagesRes.data);

          // 🆕 Mettre à jour l'état local avec les images rechargées
          const updatedProduct = { ...res.data, images: imagesRes.data };

          setProducts((prev) =>
            prev.map((p) => (p.id === editProduct.id ? updatedProduct : p))
          );
        } else {
          const res = await createProduct(values);

          // Upload images seulement si la création a réussi et qu'il y a des images
          if (res.data?.id && newImages.length > 0) {
            await uploadImages(res.data.id, newImages);

            // 🔄 Récupérer les images juste après l'upload
            const imagesRes = await getImages(res.data.id);
            setExistingImages(imagesRes.data);

            const newProduct = { ...res.data, images: imagesRes.data };

            setProducts((prev) => [...prev, newProduct]);
          } else {
            setProducts((prev) => [...prev, res.data]);
          }
        }
        resetForm();
        setNewImages([]);
        newPreviewImages.forEach(URL.revokeObjectURL);
        setNewPreviewImages([]);
        setExistingImages([]);
        setEditProduct(null);
        setIsDialogOpen(false);
        setSuccessMessage(
          editProduct
            ? "Modification effectuée avec succès."
            : "Produit ajouté avec succès."
        );
      } catch (error) {
        console.error("Erreur création/modification produit", error);
        setErrorMessage("Une erreur est survenue lors de l'enregistrement.");
      } finally {
        setIsLoading(false);
      }
    },
  });

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

  const openEditModal = async (product: Product) => {
    formik.setValues({
      ...product,
      price: Number(product.price),
      stock: Number(product.stock ?? 0),
      categoryId: Number(product.categoryId ?? 0),
    });

    // setSelectedImages([]);
    // setPreviewImages([]);
    setImageError("");
    setEditProduct(product);
    setIsDialogOpen(true);
    setImagesToDelete([]); // reset les suppressions temporaires
    setExistingImages(product.images || []);
    // setNewImages([]);
    // newPreviewImages.forEach(URL.revokeObjectURL);
    // setNewPreviewImages([]);

    // Récupérer les images depuis le backend
    try {
      const res = await getImages(product.id);
      setExistingImages(res.data);
      setNewImages([]); // Reset les nouvelles images
      newPreviewImages.forEach(URL.revokeObjectURL);
      setNewPreviewImages([]);
    } catch (err) {
      console.error("Erreur chargement des images du produit", err);
      setErrorMessage("Erreur lors du chargement des images du produit.");
    }
  };

  // Gestion du changement des fichiers images
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    e.target.value = ""; // permet de retrigger l'event même si mêmes fichiers

    // Nombre total après ajout
    const totalImages = existingImages.length + newImages.length + files.length;

    if (files.length === 0) {
      setImageError("Au moins une image est obligatoire.");
      return;
    }
    if (totalImages > 5) {
      setImageError("Maximum 5 images autorisées");
      return;
    }
    // if (files.length > 5) {
    //   setImageError("Maximum 5 images autorisées");
    //   const limitedFiles = files.slice(0, 5);
    //   setSelectedImages(limitedFiles);
    //   setPreviewImages(limitedFiles.map((file) => URL.createObjectURL(file)));
    //   return;
    // }

    setImageError("");
    const updatedNewImages = [...newImages, ...files];
    const updatedNewPreviews = [
      ...newPreviewImages,
      ...files.map((file) => URL.createObjectURL(file)),
    ];
    setNewImages(updatedNewImages);
    setNewPreviewImages(updatedNewPreviews);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Erreur suppression produit", error);
      setErrorMessage("Erreur lors de la suppression du produit.");
    }
  };
  const confirmDeleteImage = async () => {
    try {
      await deleteImage(editProduct!.id, confirmDeleteImageId!);
      setExistingImages((prev) =>
        prev.filter((img) => img.id !== confirmDeleteImageId)
      );
      setConfirmDeleteImageId(null);
    } catch (error) {
      console.error("Erreur suppression image", error);
      setErrorMessage(
        "Une erreur est survenue lors de la suppression de l'image."
      );
    }
  };

  return (
    <Layout>
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow z-50">
          {successMessage}
        </div>
      )}
      {/* Message d'erreur toast */}
      {errorMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded shadow z-50">
          {errorMessage}
        </div>
      )}
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
            <Card key={product.id} className="relative ">
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {/* 🖼️ Affichage d’image */}
                <div className="flex space-x-2 overflow-x-auto mb-2">
                  {product.images?.map((img) => (
                    <img
                      key={img.id}
                      src={`http://localhost:5000/uploads/${img.imageUrl}`}
                      alt={product.name}
                      className="w-18 h-18 object-contain rounded border"
                    />
                  ))}
                  {/* {product.images && product.images.length > 0 && (
                    <img
                      src={`http://localhost:5000/uploads/${product.images[0].imageUrl}`}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded mb-2"
                    />
                  )} */}

                  {/* pour afficher une seule image  */}
                  {/* {product.images?.length > 0 && (
                    <img
                      src={`http://localhost:5000/uploads/${product.images?.[0].imageUrl}`}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded mb-2"
                    />
                  )} */}
                </div>

                <p className="text-gray-700 mb-2">{product.description}</p>
                <p className="font-bold text-green-600">{product.price} €</p>
                <p className="font-bold text-blue-500">
                  Stock : {product.stock}
                </p>
                <p className="text-sm text-gray-500 italic">
                  Catégorie : {product.category?.name || "Aucune"}
                </p>
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
            {/* Stock */}
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
            {/* Catégorie */}
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
                <option value={0}>-- Choisir une catégorie --</option>
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
            {/* 📸 Upload Images */}
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

              {/* 🖼️ Aperçu images existantes */}
              <div className="flex gap-2 mt-2">
                {existingImages
                  .filter((img) => !imagesToDelete.includes(img.id)) // masque visuellement
                  .map((img, index) => (
                    <div key={img.id} className="relative">
                      <img
                        src={`http://localhost:5000/uploads/${img.imageUrl}`}
                        alt={`Image existante ${index + 1}`}
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={
                          () => setImagesToDelete((prev) => [...prev, img.id]) // suppression temporaire
                        }
                        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
              </div>

              {/* 🖼️ Aperçu nouvelles images */}
              <div className="flex gap-2 mt-2">
                {newPreviewImages.map((src, index) => (
                  <div key={index} className="relative">
                    <img
                      src={src}
                      alt={`preview-${index}`}
                      className="w-20 h-20 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updatedNewImages = [...newImages];
                        const updatednewPreviews = [...newPreviewImages];
                        updatedNewImages.splice(index, 1);
                        updatednewPreviews.splice(index, 1);
                        URL.revokeObjectURL(src); // Libérer l'URL
                        setNewImages(updatedNewImages);
                        setNewPreviewImages(updatednewPreviews);
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
                  existingImages.filter(
                    (img) => !imagesToDelete.includes(img.id)
                  ).length +
                    newImages.length ===
                  0
                }
              >
                Enregistrer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
