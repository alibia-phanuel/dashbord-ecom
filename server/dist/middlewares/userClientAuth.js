"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// On importe la bibliothèque 'jsonwebtoken' pour gérer les tokens JWT et le type 'JwtPayload'.
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware d'authentification pour vérifier si l'utilisateur est authentifié via un token JWT.
const userClientAuth = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({
            success: false,
            messageKey: "required", // 👈 clé pour la traduction
        });
    }
    try {
        const tokenDecoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (tokenDecoded.id) {
            req.userId = tokenDecoded.id;
        }
        else {
            return res.status(401).json({
                success: false,
                messageKey: "required",
            });
        }
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            messageKey: "required",
        });
    }
};
// On exporte le middleware pour pouvoir l'utiliser dans d'autres fichiers de l'application.
exports.default = userClientAuth;
//Check if user is authenticated
