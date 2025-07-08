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
import { useState } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

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
  role: z.enum(["Admin", "Employé", "Client"], {
    errorMap: () => ({ message: "Rôle invalide (Admin, Employé, Client)" }),
  }),
});

type User = {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Employé" | "Client";
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
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Alice Dupont", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Jean Martin", email: "jean@example.com", role: "Client" },
    {
      id: 3,
      name: "Sophie Lambert",
      email: "sophie@example.com",
      role: "Employé",
    },
  ]);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState<
    "Tous" | "Admin" | "Employé" | "Client"
  >("Tous");

  const formik = useFormik({
    initialValues: { name: "", email: "", role: "Client" },
    validate: validateWithZod(userSchema),
    onSubmit: (values, { resetForm }) => {
      if (editUser) {
        // Modifier l'utilisateur
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editUser.id
              ? {
                  ...u,
                  ...values,
                  role: values.role as "Admin" | "Employé" | "Client",
                }
              : u
          )
        );
      } else {
        // Ajouter un nouvel utilisateur
        const newUser: User = {
          id: Date.now(),
          name: values.name,
          email: values.email,
          role: values.role as User["role"],
        };
        setUsers((prev) => [...prev, newUser]);
      }
      resetForm();
      setEditUser(null);
      setIsDialogOpen(false);
    },
  });

  const openAddModal = () => {
    formik.resetForm();
    setEditUser(null);
    setIsDialogOpen(true);
  };

  const openEditModal = (user: User) => {
    formik.setValues(user);
    setEditUser(user);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // 👀 Filtrer les utilisateurs
  const filteredUsers =
    roleFilter === "Tous" ? users : users.filter((u) => u.role === roleFilter);

  return (
    <Layout>
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
                {["Tous", "Admin", "Employé", "Client"].map((role) => (
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
            <Card key={user.id} className="relative">
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
                  onClick={() => handleDelete(user.id)}
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
                id="role"
                name="role"
                placeholder="Rôle (Admin, Employé, Client)"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.role && formik.errors.role && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.role}
                </p>
              )}
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
