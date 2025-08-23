"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// On importe le module 'nodemailer' pour pouvoir envoyer des emails depuis Node.js
const nodemailer_1 = __importDefault(require("nodemailer"));
// On importe et configure 'dotenv' pour charger les variables d'environnement depuis un fichier .env
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Charge les variables d'environnement
// Création du transporteur d'e-mails avec nodemailer
// On configure ici le service SMTP utilisé (ici, Brevo ex-Sendinblue)
const transporter = nodemailer_1.default.createTransport({
    host: "smtp-relay.brevo.com", // Adresse du serveur SMTP de Brevo
    port: 587, // Port recommandé pour le protocole SMTP avec STARTTLS
    secure: false,
    auth: {
        user: process.env.SMTP_USER, // Nom d'utilisateur, stocké dans le fichier .env
        pass: process.env.SMTP_PASSWORD, // Mot de passe, également stocké dans .env
    },
});
// On exporte le transporteur pour l'utiliser ailleurs dans l'application
exports.default = transporter;
// On exporte le transporteur pour l'utiliser ailleurs dans l'application
