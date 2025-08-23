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
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = require("../middlewares/AuthMiddleware");
const auth_controller_1 = require("../controllers/auth.controller");
const router = express_1.default.Router();
/**
 * @route   POST /login
 * @desc    Authentifie l'utilisateur et renvoie un token
 * @access  Public (tout utilisateur peut se connecter)
 */
router.post("/login", auth_controller_1.Login);
// ---------------------------
router.get("/me", AuthMiddleware_1.AuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(req.user);
    return;
}));
/**
 * @route   DELETE /logout
 * @desc    Déconnecte l'utilisateur en supprimant le token côté serveur
 * @access  Privé (nécessite un token d'authentification)
 */
// ✅ Déconnexion (optionnel)
router.post("/logout", AuthMiddleware_1.AuthMiddleware, (req, res) => {
    res.json({ message: "Déconnexion réussie" });
});
exports.default = router;
