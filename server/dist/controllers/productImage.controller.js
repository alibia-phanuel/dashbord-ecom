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
exports.deleteImage = exports.addImages = exports.getImages = void 0;
const productImage_model_1 = require("../models/productImage.model");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Ajouter une ou plusieurs images à un produit
// Lister toutes les images d’un produit
const getImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id;
        const images = yield productImage_model_1.ProductImage.findAll({ where: { productId } });
        res.json({ data: images }); // 👈 wrap dans data
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});
exports.getImages = getImages;
// Ajouter des images
const addImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id;
        if (!req.files || req.files.length === 0) {
            res.status(400).json({ message: "Aucune image téléchargée" });
            return;
        }
        const files = req.files;
        const images = yield Promise.all(files.map((file) => productImage_model_1.ProductImage.create({
            productId,
            imageUrl: file.filename,
        })));
        res.status(201).json({ data: images }); // 👈 wrap dans data
    }
    catch (error) {
        res.status(500).json({ message: "Erreur lors de l'upload", error });
    }
});
exports.addImages = addImages;
// Supprimer une image
const deleteImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, imgId } = req.params;
        const image = yield productImage_model_1.ProductImage.findOne({
            where: { id: imgId, productId: id },
        });
        if (!image) {
            res.status(404).json({ message: "Image non trouvée" });
            return;
        }
        // Supprimer fichier physique
        const filePath = path_1.default.join(__dirname, "../../uploads", image.imageUrl);
        fs_1.default.unlink(filePath, (err) => {
            if (err)
                console.error("Erreur suppression fichier:", err);
        });
        yield image.destroy();
        res.json({ message: "Image supprimée" }); // pas besoin de data
    }
    catch (error) {
        res.status(500).json({ message: "Erreur suppression", error });
    }
});
exports.deleteImage = deleteImage;
