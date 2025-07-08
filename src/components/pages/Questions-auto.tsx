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

type QA = {
  id: number;
  question: string;
  answer: string;
};

// 🛡️ Schéma Zod pour validation
const qaSchema = z.object({
  question: z
    .string()
    .min(5, "La question doit contenir au moins 5 caractères")
    .max(200, "La question ne peut pas dépasser 200 caractères"),
  answer: z
    .string()
    .min(5, "La réponse doit contenir au moins 5 caractères")
    .max(500, "La réponse ne peut pas dépasser 500 caractères"),
});

// 🔥 Fonction pour connecter Zod à Formik
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

export default function QuestionsAuto() {
  const [qas, setQas] = useState<QA[]>([]);
  const [editQA, setEditQA] = useState<QA | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formik = useFormik({
    initialValues: { question: "", answer: "" },
    validate: validateWithZod(qaSchema),
    onSubmit: (values, { resetForm }) => {
      if (editQA) {
        // Modifier
        setQas((prev) =>
          prev.map((qa) =>
            qa.id === editQA.id
              ? { ...qa, question: values.question, answer: values.answer }
              : qa
          )
        );
      } else {
        // Ajouter
        const newQA: QA = {
          id: Date.now(),
          question: values.question,
          answer: values.answer,
        };
        setQas((prev) => [...prev, newQA]);
      }
      resetForm();
      setEditQA(null);
      setIsDialogOpen(false);
    },
  });

  const openAddModal = () => {
    formik.resetForm();
    setEditQA(null);
    setIsDialogOpen(true);
  };

  const openEditModal = (qa: QA) => {
    formik.setValues({ question: qa.question, answer: qa.answer });
    setEditQA(qa);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setQas((prev) => prev.filter((qa) => qa.id !== id));
  };

  return (
    <Layout>
      <div
        className="flex flex-col items-center justify-start w-full space-y-4 p-4"
        style={{ height: "calc(100vh - 32px)" }}
      >
        <div className="flex justify-between w-full">
          <h2 className="text-3xl font-semibold">Questions / Réponses</h2>

          {/* ➕ Ajouter bouton */}
          <Button onClick={openAddModal} className="flex items-center gap-2">
            <Plus size={18} /> Ajouter
          </Button>
        </div>

        {/* 📋 Liste des Q/R */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {qas.map((qa) => (
            <Card key={qa.id} className="relative">
              <CardHeader>
                <CardTitle className="text-lg">{qa.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{qa.answer}</p>
              </CardContent>
              <div className="absolute top-2 right-2 flex space-x-2">
                {/* 📝 Modifier */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openEditModal(qa)}
                >
                  <Pencil size={16} />
                </Button>

                {/* 🗑️ Supprimer */}
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(qa.id)}
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
              {editQA
                ? "Modifier Question / Réponse"
                : "Nouvelle Question / Réponse"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <Input
                id="question"
                name="question"
                placeholder="Question"
                value={formik.values.question}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.question && formik.errors.question && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.question}
                </p>
              )}
            </div>
            <div>
              <Textarea
                id="answer"
                name="answer"
                placeholder="Réponse"
                value={formik.values.answer}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={4}
              />
              {formik.touched.answer && formik.errors.answer && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.answer}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button type="submit">
                {editQA ? "Enregistrer les modifications" : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
