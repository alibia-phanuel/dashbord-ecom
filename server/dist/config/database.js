"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Charge les variables d’environnement du fichier .env
// Création d’une instance Sequelize avec les infos de la base de données
exports.sequelize = new sequelize_1.Sequelize(process.env.DB_NAME || 'product_db', // Nom de la base
process.env.DB_USER || 'root', // Utilisateur MySQL
process.env.DB_PASSWORD || '', // Mot de passe MySQL
{
    host: process.env.DB_HOST || 'localhost', // Hôte
    dialect: 'mysql', // Type de base
    logging: false // Affiche ou non les requêtes SQL dans la console
});
