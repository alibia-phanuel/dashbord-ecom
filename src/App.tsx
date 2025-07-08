import Login from "./components/ui/auth/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import Statistique from "./components/Statistique";
import Produits from "./components/pages/Produits";
import Categories from "./components/pages/Categories";
import Utilisateurs from "./components/pages/Utilisateurs";
import Chatbot from "./components/pages/Chatbot";
import Facebook from "./components/pages/Facebook-id";
import QuestionsAuto from "./components/pages/Questions-auto";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/statistiques" element={<Statistique />} />
        <Route path="/produits" element={<Produits />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/utilisateurs" element={<Utilisateurs />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/facebook-id" element={<Facebook />} />
        <Route path="/questions-auto" element={<QuestionsAuto />} />
      </Routes>
      {/* ✅ Affiche les toasts */}
      <ToastContainer
        position="top-right"
        autoClose={3000} // ferme après 3s
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // joli thème coloré
      />
    </>
  );
}

export default App;
