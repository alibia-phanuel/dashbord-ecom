"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Product extends sequelize_1.Model {
} // Modèle Product
exports.Product = Product;
Product.init({
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: sequelize_1.DataTypes.TEXT, // Description non obligatoire
    price: {
        type: sequelize_1.DataTypes.DECIMAL,
        allowNull: false,
    },
    stock: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    categoryId: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: "Categories", // ou Category si tu veux que Sequelize gère automatiquement
            key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
}, {
    sequelize: database_1.sequelize, // Instance Sequelize
    modelName: "Product", // Nom du modèle
    timestamps: true, // Ajoute createdAt et updatedAt
});
