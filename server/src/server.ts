import dotenv from "dotenv";
// Import du package dotenv pour charger les variables d'environnement

import { sequelize } from "./config/database";
// Import de l'instance Sequelize configurée pour la base MySQL

import app from "./app";
// Import de l'application Express définie dans app.ts

dotenv.config();
// Chargement des variables d'environnement depuis le fichier .env

// 📦 Import des modèles Sequelize
import "./models";

const PORT = process.env.PORT || 5000;
// Récupération du port dans les variables d'environnement ou 5000 par défaut

// Test de la connexion à la base MySQL avec Sequelize
sequelize
  .authenticate()
  .then(async () => {
    console.log("Connexion à MySQL réussie");

    // Synchronisation des modèles Sequelize avec la base (création/modification des tables)
    await sequelize.sync({ alter: true });
    console.log("Base de données synchronisée");

    // Démarrage du serveur Express sur le port défini
    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    // Gestion d'erreur si la connexion à MySQL échoue
    console.error("Erreur de connexion MySQL:", error);
  });
