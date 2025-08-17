import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config(); // Charger les variables d'environnement dès le début
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model"; // Assure-toi que ce modèle est bien défini
const SECRET_KEY = process.env.JWT_SECRET || "Kx8Zm4VqT9NcY7PwJ2Bd5H6G3RLMAQX";
// ✅ Étendre `Request` pour inclure `user`

// ➤ Interface pour typer `req.user`
interface AuthRequest extends Request {
  user?: {
    id: number;
    role: "employee" | "admin";
  };
}
const SALT_ROUNDS = 10; // Niveau de hashage

// ➤ Fonction d'inscription d'un utilisateur

export const Login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    // Vérification des champs
    if (!email || !password) {
      res.status(400).json({ message: "Email et mot de passe requis" });
      return;
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(400).json({ message: "Identifiants incorrects" });
      return;
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Identifiants incorrects" });
      return;
    }

    // Générer un token JWT
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "7d",
    });

    // ✅ Réponse adaptée au frontend
    res.json({
      message: "Connexion réussie",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error });
    return;
  }
};
