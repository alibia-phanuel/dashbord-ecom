"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminMiddleware = exports.AuthMiddleware = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model")); // Assurez-vous que le chemin est correct
dotenv_1.default.config(); // Charger les variables d'environnement dès le début
const SECRET_KEY = process.env.JWT_SECRET ||
    "c480d778c8e612ee004c25d62af12405da22359c28967c90f4145760987dd19c"; // Remplace par une vraie clé secrète
// ✅ Étendre `Request` pour inclure `user`
// ✅ Middleware pour vérifier le token
const AuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        // console.log("Token reçu:", token); // Vérifie le token reçu
        if (!token) {
            res.status(401).json({ message: "Accès refusé, token manquant" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        // console.log("Decoded token:", decoded); // Vérifie les informations du token
        const user = yield user_model_1.default.findByPk(decoded.id);
        if (!user) {
            res.status(401).json({ message: "Utilisateur non trouvé" });
            return;
        }
        req.user = {
            id: user.id,
            uuid: user.uuid,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePicture: user.profilePicture,
            createdBy: user.createdBy,
        };
        next(); // Passer à la route suivante
    }
    catch (error) {
        res.status(401).json({ message: "Token invalide", error });
    }
});
exports.AuthMiddleware = AuthMiddleware;
// Middleware pour vérifier si l'utilisateur est un administrateur
const AdminMiddleware = (req, res, next) => {
    // Ajout explicite du type `void`
    if (!req.user || req.user.role !== "admin") {
        res
            .status(403)
            .json({ message: "Accès refusé. Vous devez être administrateur." });
        return; // Ajout du `return` pour arrêter l'exécution
    }
    next(); // ✅ Correct
};
exports.AdminMiddleware = AdminMiddleware;
function next() {
    throw new Error("Function not implemented.");
}
