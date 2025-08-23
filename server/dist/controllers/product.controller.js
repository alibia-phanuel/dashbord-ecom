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
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const product_model_1 = require("../models/product.model");
const category_model_1 = require("../models/category.model");
const productImage_model_1 = require("../models/productImage.model");
// Lister tous les produits avec leurs images et catégorie
// Lister tous les produits
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_model_1.Product.findAll({
            include: [
                { model: productImage_model_1.ProductImage, as: "images" },
                { model: category_model_1.Category, as: "category", attributes: ["name"] },
            ],
        });
        res.json({ data: products }); // 👈 wrap dans { data }
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});
exports.getAllProducts = getAllProducts;
// Obtenir un produit par ID
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_model_1.Product.findByPk(req.params.id, {
            include: [
                { model: productImage_model_1.ProductImage, as: "images" },
                { model: category_model_1.Category, as: "category" },
            ],
        });
        if (!product) {
            res.status(404).json({ message: "Produit non trouvé" });
            return;
        }
        res.json({ data: product }); // 👈 wrap dans { data }
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});
exports.getProductById = getProductById;
// Créer un produit
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price, stock, categoryId } = req.body;
        const product = yield product_model_1.Product.create({ name, description, price, stock, categoryId });
        const productWithCategory = yield product_model_1.Product.findByPk(product.id, {
            include: { model: category_model_1.Category, as: "category", attributes: ["name"] },
        });
        res.status(201).json({ data: productWithCategory }); // 👈 wrap
    }
    catch (error) {
        res.status(400).json({ message: "Données invalides", error });
    }
});
exports.createProduct = createProduct;
// Modifier un produit
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price, stock, categoryId } = req.body;
        const product = yield product_model_1.Product.findByPk(req.params.id);
        if (!product) {
            res.status(404).json({ message: "Produit non trouvé" });
            return;
        }
        yield product.update({ name, description, price, stock, categoryId });
        const updatedProduct = yield product_model_1.Product.findByPk(product.id, {
            include: [{ association: "category" }],
        });
        res.json({ data: updatedProduct }); // 👈 wrap
    }
    catch (error) {
        res.status(400).json({ message: "Erreur mise à jour", error });
    }
});
exports.updateProduct = updateProduct;
// Supprimer un produit
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_model_1.Product.findByPk(req.params.id);
        if (!product) {
            res.status(404).json({ message: "Produit non trouvé" });
            return;
        }
        yield productImage_model_1.ProductImage.destroy({ where: { productId: product.id } });
        yield product.destroy();
        res.json({ message: "Produit supprimé" }); // ici pas besoin de data
    }
    catch (error) {
        res.status(500).json({ message: "Erreur suppression", error });
    }
});
exports.deleteProduct = deleteProduct;
