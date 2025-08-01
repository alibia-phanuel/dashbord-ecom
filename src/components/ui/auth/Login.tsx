"use client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import metaBg from "../../../assets/meta.jpg";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginUser } from "@/api/authApi";
const loginSchema = z.object({
  email: z.string().email("Email invalide").nonempty("Email requis"),
  password: z
    .string()
    .min(6, "Mot de passe trop court")
    .nonempty("Mot de passe requis"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {

    // 🟢 Appel à l'API pour authentifier l'utilisateur
    const response = await loginUser({
      email: values.email,
      password: values.password,
    });

    // recupérer le token de la réponse
    const token = response.data.token;

    // stocker le token dans le localStorage
    localStorage.setItem("token", token);

    // afficher un message de succès
    toast.success("Connexion réussie !");

    // Redirection apres un petit délai pour laisser le toast s'afficher
    setTimeout(() => {
      navigate("/statistiques");
    }, 1500);
   } catch (error) {
    console.error("Erreur lors de la connexion", error);
    toast.error("Erreur lors de la connexion");
   } finally {
    setLoading(false);
   }
    // console.log("Envoi des données…", values);

    // // Simulation d’un appel API
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    // console.log("Réponse API : connexion réussie !");
    // setLoading(false);

    // // ✅ Affiche une notification toast
    // toast.success("Connexion réussie !");

    // // 🚀 Redirige vers Home après un petit délai
    // setTimeout(() => {
    //   navigate("/statistiques");
    // }, 1500); // attend 1.5s pour laisser voir le toast
  };
  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${metaBg})`,
      }}
    >
      <Card className="w-full max-w-md shadow-xl ">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Connexion à Metaben Sarl
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={toFormikValidationSchema(loginSchema)}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit, isSubmitting }) => (
              <Form onSubmit={handleSubmit} className="space-y-4 ">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="exemple@metaben.com"
                    as={Input}
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium"
                  >
                    Mot de passe
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    as={Input}
                  />
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || isSubmitting}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion…
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}
