"use client";

import { useState, useEffect } from "react";
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
import { Trash2, Pencil, Plus, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { fetchUsers, createUser, updateUser, deleteUser } from "@/api/userApi";
import type { User, UserFormValues } from "@/types/type";

// 🛡️ Schémas Zod pour la validation des utilisateurs
const userSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  email: z
    .string()
    .email("Adresse e-mail invalide")
    .max(100, "L'e-mail ne peut pas dépasser 100 caractères"),
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

export default function Utilisateurs() {
  // 🗄️ Gestion de l'état
  const [users, setUsers] = useState<User[]>([]);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState<
    "Tous" | "Admin" | "Employé" | "Client"
  >("Tous");
  const [uuidToDelete, setUuidToDelete] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 📡 Chargement des utilisateurs au montage
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchUsers();
        setUsers(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs :", error);
        setErrorMessage("Échec du chargement des utilisateurs.");
      }
    };
    loadUsers();
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

  // 📝 Configuration de Formik pour le formulaire d'utilisateur
  const formik = useFormik<UserFormValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "client",
    },
    validate: (values) => {
      return editUser
        ? validateWithZod(userUpdateSchema)(values)
        : validateWithZod(userCreateSchema)(values);
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editUser) {
          // 🔄 Mise à jour de l'utilisateur
          const { password, ...rest } = values;
          const updateData = password.trim() ? values : rest;
          await updateUser(editUser.uuid, updateData);
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
          setSuccessMessage("Utilisateur mis à jour avec succès.");
        } else {
          // ➕ Création d'un nouvel utilisateur
          const response = await createUser(values);
          setUsers((prev) => [...prev, response.data]);
          setSuccessMessage("Utilisateur ajouté avec succès.");
        }
        resetForm();
        setEditUser(null);
        setIsDialogOpen(false);
      } catch (error) {
        console.error(
          "Erreur lors de l'enregistrement de l'utilisateur :",
          error
        );
        setErrorMessage(
          "Une erreur s'est produite lors de l'enregistrement de l'utilisateur."
        );
      }
    },
  });

  // ➕ Ouvrir la modale pour ajouter un nouvel utilisateur
  const openAddModal = () => {
    formik.resetForm();
    setEditUser(null);
    setIsDialogOpen(true);
  };

  // 📝 Ouvrir la modale pour modifier un utilisateur
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

  // 🗑️ Supprimer un utilisateur
  const confirmDelete = async () => {
    if (!uuidToDelete) return;
    try {
      await deleteUser(uuidToDelete);
      setUsers((prev) => prev.filter((u) => u.uuid !== uuidToDelete));
      setIsConfirmOpen(false);
      setUuidToDelete(null);
      setSuccessMessage("Utilisateur supprimé avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
      setErrorMessage("Échec de la suppression de l'utilisateur.");
    }
  };

  // 👀 Filtrer les utilisateurs par rôle
  const filteredUsers =
    roleFilter === "Tous"
      ? users
      : users.filter((u) => u.role.toLowerCase() === roleFilter.toLowerCase());

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

      {/* ✅ Dialogue de confirmation pour la suppression */}
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

      <div className="flex flex-col items-center justify-start w-full space-y-4 p-4 h-[calc(100vh-32px)]">
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
                {["Tous", "Admin", "Employé", "Client"].map((role) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() =>
                      setRoleFilter(
                        role as "Tous" | "Admin" | "Employé" | "Client"
                      )
                    }
                  >
                    {role}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {/* ➕ Bouton pour ajouter un utilisateur */}
            <Button onClick={openAddModal} className="flex items-center gap-2">
              <Plus size={18} /> Ajouter un utilisateur
            </Button>
          </div>
        </div>

        {/* 📋 Liste des utilisateurs filtrés */}
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
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openEditModal(user)}
                >
                  <Pencil size={16} />
                </Button>
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

      {/* ✅ Modale pour ajouter/modifier un utilisateur */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
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
                placeholder="Adresse e-mail"
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
                <option value="">-- Sélectionner un rôle --</option>
                <option value="admin">Admin</option>
                <option value="employe">Employé</option>
                <option value="client">Client</option>
              </select>
              {formik.touched.role && formik.errors.role && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.role}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button type="submit">
                {editUser
                  ? "Enregistrer les modifications"
                  : "Ajouter l'utilisateur"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
