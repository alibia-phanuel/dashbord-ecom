"use client";

import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/ui/auth/Login";
import Statistique from "./components/pages/Statistique";
import Produits from "./components/pages/Produits";
import Categories from "./components/pages/Categories";
import Utilisateurs from "./components/pages/Utilisateurs";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/statistiques" element={<Statistique />} />
        <Route path="/produits" element={<Produits />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/utilisateurs" element={<Utilisateurs />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}
