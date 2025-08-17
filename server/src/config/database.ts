import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Charge les variables d’environnement du fichier .env

// Création d’une instance Sequelize avec les infos de la base de données
export const sequelize = new Sequelize(
  process.env.DB_NAME || 'product_db',          // Nom de la base
  process.env.DB_USER || 'root',                // Utilisateur MySQL
  process.env.DB_PASSWORD || '',                // Mot de passe MySQL
  {
    host: process.env.DB_HOST || 'localhost',   // Hôte
    dialect: 'mysql',                           // Type de base
    logging: false                              // Affiche ou non les requêtes SQL dans la console
  }
);
