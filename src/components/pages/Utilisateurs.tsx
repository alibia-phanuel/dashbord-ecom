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
import { Trash2, Pencil, Plus, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  fetchUsers,
  //fetchUserById,
  createUser,
  updateUser,
  deleteUser,
} from "@/api/userApi";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

// 🛡️ Schéma Zod pour valider les utilisateurs
const userSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  email: z
    .string()
    .email("Adresse email invalide")
    .max(100, "L'email ne peut pas dépasser 100 caractères"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .optional(),
  role: z.enum(["admin", "employe", "client"], {
    errorMap: () => ({ message: "Rôle invalide (Admin, Employé, Client)" }),
  }),
});
const userCreateSchema = userSchema.extend({
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

const userUpdateSchema = userSchema.extend({
  password: z
    .string()
    .optional()
    .refine(
      (val) => val === undefined || val === "" || val.length >= 8,
      "Le mot de passe doit contenir au moins 8 caractères"
    ),
});

type User = {
  id: string;
  uuid: string;
  name: string;
  email: string;
  role: "admin" | "employe" | "client";
};

// Données du formulaire (création / modification) qui incluent le mot de passe
type UserFormValues = {
  name: string;
  email: string;
  password: string; // Obligatoire à la création, optionnel à la modification
  role: "admin" | "employe" | "client";
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

export default function Utilisateurs() {
  const [users, setUsers] = useState<User[]>([]);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState<
    "Tous" | "Admin" | "Employe" | "Client"
  >("Tous");
  const [uuidToDelete, setUuidToDelete] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchUsers();
        setUsers(response.data); // Assure-toi que ton backend renvoie bien un tableau au format attendu
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs", error);
      }
    };
    loadUsers();
  }, []);
  const formik = useFormik<UserFormValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "client",
    },
    validate: (values) => {
      if (editUser) {
        // édition : mot de passe optionnel
        return validateWithZod(userUpdateSchema)(values);
      } else {
        // création : mot de passe obligatoire
        return validateWithZod(userCreateSchema)(values);
      }
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editUser) {
          // Modification : si password vide, on l'exclut de l'objet envoyé
          const { password, ...rest } = values;
          const updateData = password.trim() ? values : rest;

          const response = await updateUser(editUser.uuid, updateData);
          console.log("Réponse backend :", response.data);
          setUsers((prev) =>
            prev.map((u) =>
              u.uuid === editUser.uuid
                ? {
                    ...u,
                    name: values.name,
                    email: values.email,
                    role: values.role,
                  }
                : u
            )
          );
        } else {
          // Création : mot de passe obligatoire
          const response = await createUser(values);
          setUsers((prev) => [...prev, response.data.user]);
        }

        resetForm();
        setEditUser(null);
        setIsDialogOpen(false);
      } catch (error) {
        console.error("Erreur lors de la sauvegarde", error);
        alert("Une erreur est survenue.");
      }
    },
  });

  const openAddModal = () => {
    formik.resetForm();
    setEditUser(null);
    setIsDialogOpen(true);
  };

  const openEditModal = (user: User) => {
    formik.setValues({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
    setEditUser(user);
    setIsDialogOpen(true);
  };

  // const handleDelete = async (uuid: string) => {
  //   try {
  //     await deleteUser(uuid); // Appelle réellement l'API
  //     setUsers((prev) => prev.filter((u) => u.uuid !== uuid)); // Supprime dans l'état local
  //   } catch (error) {
  //     console.error("Erreur suppression utilisateur :", error);
  //   }
  // };
  const confirmDelete = async () => {
    if (!uuidToDelete) return;

    try {
      await deleteUser(uuidToDelete);
      setUsers((prev) => prev.filter((u) => u.uuid !== uuidToDelete));
      setIsConfirmOpen(false);
      setUuidToDelete(null);
      toast.success("Utilisateur supprimée avec succes!");
    } catch (error) {
      console.error("Erreur suppression utilisateur :", error);
      alert("Erreur lors de la suppression.");
    }
  };


  // 👀 Filtrer les utilisateurs
  const filteredUsers =
    roleFilter === "Tous"
      ? users
      : users.filter(
        (u) => u.role?.toLowerCase() === roleFilter.toLocaleLowerCase());

  return (
    <Layout>
      {isConfirmOpen && (
        <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
            </DialogHeader>
            <div>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</div>
            <DialogFooter className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <div
        className="flex flex-col items-center justify-start w-full space-y-4 p-4"
        style={{ height: "calc(100vh - 32px)" }}
      >
        <div className="flex justify-between w-full">
          <h2 className="text-3xl font-semibold">Utilisateurs</h2>
          <div className="flex gap-2">
            {/* 🔽 Filtre par rôle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter size={16} /> {roleFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {["Tous", "Admin", "Employe", "Client"].map((role) => (
                  <DropdownMenuItem
                    key={role}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onClick={() => setRoleFilter(role as any)}
                  >
                    {role}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {/* ➕ Ajouter bouton */}
            <Button onClick={openAddModal} className="flex items-center gap-2">
              <Plus size={18} /> Ajouter
            </Button>
          </div>
        </div>

        {/* 📋 Liste des utilisateurs filtrée */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {filteredUsers.map((user) => (
            <Card key={user.uuid} className="relative">
              <CardHeader>
                <CardTitle className="text-lg">{user.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-1">{user.email}</p>
                <p className="font-semibold text-indigo-600">{user.role}</p>
              </CardContent>
              <div className="absolute top-2 right-2 flex space-x-2">
                {/* 📝 Modifier */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openEditModal(user)}
                >
                  <Pencil size={16} />
                </Button>
                {/* 🗑️ Supprimer */}
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    setUuidToDelete(user.uuid);
                    setIsConfirmOpen(true);
                  }}
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
              {editUser ? "Modifier Utilisateur" : "Nouvel Utilisateur"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <Input
                id="name"
                name="name"
                placeholder="Nom complet"
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
              <Input
                id="email"
                name="email"
                placeholder="Adresse email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>
            <div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Mot de passe"
                value={formik.values.password || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>
            <div>
              <select
                id="role"
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border rounded p-2"
              >
                <option value="">-- Choisir un role --</option>
                <option value="admin">Admin</option>
                <option value="employe">Employé</option>
                <option value="client">Client</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="submit">
                {editUser ? "Enregistrer les modifications" : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
