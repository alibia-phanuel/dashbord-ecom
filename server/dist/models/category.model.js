"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Category extends sequelize_1.Model {
} // Création du modèle Category
exports.Category = Category;
Category.init({
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false, // Le nom est obligatoire
    },
}, {
    sequelize: database_1.sequelize, // Instance Sequelize
    modelName: "Category", // Nom du modèle
    timestamps: true, // Ajoute createdAt et updatedAt
});
