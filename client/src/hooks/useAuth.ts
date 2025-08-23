import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/api/authApi";
import { toast } from "react-toastify";

export const useAuth = () => {
  const navigate = useNavigate();

  const logout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await logoutUser(token); // appel API logout
    } catch (err) {
      console.error("Erreur pendant la déconnexion", err);
    }

    localStorage.removeItem("token"); // supprime le token
    toast.success("Déconnecté avec succès !");
    navigate("/"); // redirige vers login
  };

  return { logout };
};
