import { Request, Response } from "express";
import express from "express";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { Login } from "../controllers/auth.controller";
interface AuthRequest extends Request {
  user?: {
    id: string;
    uuid: string;
    role: string;
    name: string;
    email: string;
    profilePicture: string | null;
    createdBy: string | null;
  };
}
const router = express.Router();
/**
 * @route   POST /login
 * @desc    Authentifie l'utilisateur et renvoie un token
 * @access  Public (tout utilisateur peut se connecter)
 */
router.post("/login", Login);
// ---------------------------
router.get(
  "/me",
  AuthMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    res.json(req.user);
    return;
  }
);

/**
 * @route   DELETE /logout
 * @desc    Déconnecte l'utilisateur en supprimant le token côté serveur
 * @access  Privé (nécessite un token d'authentification)
 */
// ✅ Déconnexion (optionnel)
router.post("/logout", AuthMiddleware, (req: AuthRequest, res: Response) => {
  res.json({ message: "Déconnexion réussie" });
});
export default router;
