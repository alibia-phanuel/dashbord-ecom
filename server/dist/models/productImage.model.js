"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductImage = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class ProductImage extends sequelize_1.Model {
} // Modèle Image
exports.ProductImage = ProductImage;
ProductImage.init({
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    productId: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false, // L'image doit obligatoirement appartenir à un produit
    },
    imageUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false, // Chemin ou URL de l’image
    },
}, {
    sequelize: database_1.sequelize, // Instance Sequelize
    modelName: "ProductImage", // Nom du modèle
    timestamps: true, // Ajoute createdAt et updatedAt
});
