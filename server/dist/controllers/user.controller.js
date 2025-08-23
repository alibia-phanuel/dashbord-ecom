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
exports.getUserById = exports.getAllUsers = exports.deleteUser = exports.updateUser = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const user_model_1 = __importDefault(require("../models/user.model")); // Assure-toi que ce modèle est bien défini
const SALT_ROUNDS = 10; // Niveau de hashage
// ➤ Fonction d'inscription d'un utilisateur
const createUser = (req, // Utilisation de l'interface AuthRequest ici
res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { name, email, password, role } = req.body;
        // 🔐 Validation des champs obligatoires
        if (!name || !email || !password || !role) {
            res.status(400).json({ message: "Tous les champs sont requis." });
            return;
        }
        // ✅ Validation du rôle
        if (!["admin", "employe", "client"].includes(role)) {
            res
                .status(400)
                .json({ message: "Rôle invalide (admin,employe ou client requis)." });
            return;
        }
        // Vérifier si l'utilisateur existe déjà
        const existingUser = yield user_model_1.default.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: "Email déjà utilisé" });
            return;
        }
        // Hachage du mot de passe
        const hashedPassword = yield bcrypt_1.default.hash(password, SALT_ROUNDS);
        // Création de l'utilisateur
        const newUser = yield user_model_1.default.create({
            uuid: (0, uuid_1.v4)(),
            name,
            email,
            password: hashedPassword,
            role,
            createdBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id, // Vérifie que `req.user` est bien défini
        });
        // Récupération des infos de l'admin qui a ajouté l'utilisateur
        const createdByUser = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)
            ? yield user_model_1.default.findByPk(req.user.id, {
                attributes: ["name", "email", "role"], // On récupère les infos essentielles
            })
            : null;
        // 📦 Masquer le mot de passe dans la réponse
        const userToReturn = Object.assign(Object.assign({}, newUser.toJSON()), { password: undefined });
        res.status(201).json({
            message: "Utilisateur créé avec succès",
            user: userToReturn,
            createdBy: createdByUser, // On inclut les détails de l'administrateur (ou employeur)
        });
    }
    catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, email, password, role, profilePicture } = req.body;
        // Vérifier si l'ID est fourni
        if (!id) {
            res.status(400).json({ message: "L'ID de l'utilisateur est requis" });
            return;
        }
        // Vérifier si l'utilisateur existe
        const user = yield user_model_1.default.findOne({ where: { uuid: id } });
        if (!user) {
            res.status(404).json({ message: "Utilisateur non trouvé" });
            return;
        }
        let hashPassword = user.password; // Garder le mot de passe existant par défaut
        // Si un nouveau mot de passe est fourni, le hasher avec bcrypt
        if (password) {
            const saltRounds = 10;
            hashPassword = yield bcrypt_1.default.hash(password, saltRounds);
        }
        // Mise à jour de l'utilisateur
        yield user_model_1.default.update({ name, email, password: hashPassword, role, profilePicture }, { where: { uuid: id } });
        res.status(200).json({ message: "Utilisateur mis à jour avec succès" });
    }
    catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
        if (error.name === "SequelizeValidationError") {
            res.status(400).json({
                message: "Erreur de validation des données",
                error: error.errors.map((err) => err.message),
            });
        }
        else if (error.name === "SequelizeConnectionError") {
            res.status(500).json({
                message: "Erreur de connexion à la base de données",
                error: error.message,
            });
        }
        else if (error.name === "SequelizeDatabaseError") {
            res.status(500).json({
                message: "Erreur de base de données",
                error: error.message,
            });
        }
        else {
            res.status(500).json({
                message: "Erreur serveur lors de la mise à jour de l'utilisateur",
                error: error.message,
            });
        }
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Vérifier si l'UUID est fourni
        if (!id) {
            res.status(400).json({ message: "L'UUID de l'utilisateur est requis" });
            return;
        }
        // Vérifier si l'utilisateur existe
        const user = yield user_model_1.default.findOne({ where: { uuid: id } });
        if (!user) {
            res.status(404).json({ message: "Utilisateur non trouvé" });
            return;
        }
        // Suppression de l'utilisateur
        yield user_model_1.default.destroy({ where: { uuid: id } });
        res.status(200).json({ message: "Utilisateur supprimé avec succès" });
    }
    catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur:", error);
        if (error.name === "SequelizeForeignKeyConstraintError") {
            res.status(400).json({
                message: "Impossible de supprimer cet utilisateur car il est lié à d'autres données",
                error: error.message,
            });
        }
        else if (error.name === "SequelizeConnectionError") {
            res.status(500).json({
                message: "Erreur de connexion à la base de données",
                error: error.message,
            });
        }
        else {
            res.status(500).json({
                message: "Erreur serveur lors de la suppression de l'utilisateur",
                error: error.message,
            });
        }
    }
});
exports.deleteUser = deleteUser;
// Récupérer tous les utilisateurs
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.findAll({
            attributes: ["uuid", "name", "email", "role", "profilePicture"],
        });
        res.status(200).json({ data: users }); // 👈 wrap dans data
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});
exports.getAllUsers = getAllUsers;
// Récupérer un utilisateur par ID
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield user_model_1.default.findOne({
            attributes: ["uuid", "name", "email", "role", "profilePicture"],
            where: { uuid: id },
        });
        if (!user) {
            res.status(404).json({ message: "Utilisateur non trouvé" });
            return;
        }
        res.status(200).json({ data: user }); // 👈 wrap dans data
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});
exports.getUserById = getUserById;
