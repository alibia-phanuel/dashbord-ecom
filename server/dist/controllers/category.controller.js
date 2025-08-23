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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getAllCategories = void 0;
const category_model_1 = require("../models/category.model");
// Lister toutes les catégories
// Lister toutes les catégories
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_model_1.Category.findAll();
        res.json({ data: categories }); // 👈 wrap dans data
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});
exports.getAllCategories = getAllCategories;
// Obtenir une catégorie par ID
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield category_model_1.Category.findByPk(req.params.id);
        if (!category) {
            res.status(404).json({ message: "Catégorie non trouvée" });
            return;
        }
        res.json({ data: category }); // 👈 wrap dans data
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});
exports.getCategoryById = getCategoryById;
// Créer une catégorie
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const category = yield category_model_1.Category.create({ name });
        res.status(201).json({ data: category }); // 👈 wrap dans data
    }
    catch (error) {
        res.status(400).json({ message: "Données invalides", error });
    }
});
exports.createCategory = createCategory;
// Modifier une catégorie
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const category = yield category_model_1.Category.findByPk(req.params.id);
        if (!category) {
            res.status(404).json({ message: "Catégorie non trouvée" });
            return;
        }
        yield category.update({ name });
        res.json({ data: category }); // 👈 wrap dans data
    }
    catch (error) {
        res.status(400).json({ message: "Erreur mise à jour", error });
    }
});
exports.updateCategory = updateCategory;
// Supprimer une catégorie
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield category_model_1.Category.findByPk(req.params.id);
        if (!category) {
            res.status(404).json({ message: "Catégorie non trouvée" });
            return;
        }
        yield category.destroy();
        res.json({ message: "Catégorie supprimée" });
    }
    catch (error) {
        res.status(500).json({ message: "Erreur suppression", error });
    }
});
exports.deleteCategory = deleteCategory;
