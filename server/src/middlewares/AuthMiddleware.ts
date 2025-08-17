import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/user.model"; // Assurez-vous que le chemin est correct
dotenv.config(); // Charger les variables d'environnement dès le début
// Définition de l'interface pour l'utilisateur
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

const SECRET_KEY: string =
  process.env.JWT_SECRET ||
  "c480d778c8e612ee004c25d62af12405da22359c28967c90f4145760987dd19c"; // Remplace par une vraie clé secrète

// ✅ Étendre `Request` pour inclure `user`

// ✅ Middleware pour vérifier le token
export const AuthMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    // console.log("Token reçu:", token); // Vérifie le token reçu
    if (!token) {
      res.status(401).json({ message: "Accès refusé, token manquant" });
      return;
    }

    const decoded = jwt.verify(token, SECRET_KEY) as { id: string };
    // console.log("Decoded token:", decoded); // Vérifie les informations du token
    const user = await User.findByPk(decoded.id);

    if (!user) {
      res.status(401).json({ message: "Utilisateur non trouvé" });
      return;
    }

    req.user = {
      id: user.id,
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      role: user.role as "admin" | "employee",
      profilePicture: user.profilePicture,
      createdBy: user.createdBy,
    };

    next(); // Passer à la route suivante
  } catch (error) {
    res.status(401).json({ message: "Token invalide", error });
  }
};

// Middleware pour vérifier si l'utilisateur est un administrateur
export const AdminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  // Ajout explicite du type `void`
  if (!req.user || req.user.role !== "admin") {
    res
      .status(403)
      .json({ message: "Accès refusé. Vous devez être administrateur." });
    return; // Ajout du `return` pour arrêter l'exécution
  }
  next(); // ✅ Correct
};
function next() {
  throw new Error("Function not implemented.");
}
