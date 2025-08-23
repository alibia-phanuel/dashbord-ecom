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
const dotenv_1 = __importDefault(require("dotenv"));
// Import du package dotenv pour charger les variables d'environnement
const database_1 = require("./config/database");
// Import de l'instance Sequelize configurée pour la base MySQL
const app_1 = __importDefault(require("./app"));
// Import de l'application Express définie dans app.ts
dotenv_1.default.config();
// Chargement des variables d'environnement depuis le fichier .env
// 📦 Import des modèles Sequelize
require("./models");
const PORT = process.env.PORT || 5000;
// Récupération du port dans les variables d'environnement ou 5000 par défaut
// Test de la connexion à la base MySQL avec Sequelize
database_1.sequelize
    .authenticate()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Connexion à MySQL réussie");
    // Synchronisation des modèles Sequelize avec la base (création/modification des tables)
    yield database_1.sequelize.sync({ alter: true });
    console.log("Base de données synchronisée");
    // Démarrage du serveur Express sur le port défini
    app_1.default.listen(PORT, () => {
        console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
    });
}))
    .catch((error) => {
    // Gestion d'erreur si la connexion à MySQL échoue
    console.error("Erreur de connexion MySQL:", error);
});
