"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Userclient = exports.Category = exports.ProductImage = exports.Product = exports.sequelize = void 0;
const database_1 = require("../config/database");
Object.defineProperty(exports, "sequelize", { enumerable: true, get: function () { return database_1.sequelize; } });
const product_model_1 = require("./product.model");
Object.defineProperty(exports, "Product", { enumerable: true, get: function () { return product_model_1.Product; } });
const productImage_model_1 = require("./productImage.model");
Object.defineProperty(exports, "ProductImage", { enumerable: true, get: function () { return productImage_model_1.ProductImage; } });
const category_model_1 = require("./category.model");
Object.defineProperty(exports, "Category", { enumerable: true, get: function () { return category_model_1.Category; } });
const userClient_model_1 = __importDefault(require("./userClient.model"));
exports.Userclient = userClient_model_1.default;
// Product appartient à Category (1 catégorie peut avoir plusieurs produits)
category_model_1.Category.hasMany(product_model_1.Product, { foreignKey: 'categoryId' });
product_model_1.Product.belongsTo(category_model_1.Category, { foreignKey: 'categoryId', as: 'category' });
// Product a plusieurs images
product_model_1.Product.hasMany(productImage_model_1.ProductImage, { foreignKey: 'productId', as: 'images' });
productImage_model_1.ProductImage.belongsTo(product_model_1.Product, { foreignKey: 'productId' });
