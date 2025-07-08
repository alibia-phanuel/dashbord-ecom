import Login from "./components/ui/auth/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import Statistique from "./components/Statistique";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/statistiques" element={<Statistique />} />
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
