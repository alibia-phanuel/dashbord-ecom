// On importe le module 'nodemailer' pour pouvoir envoyer des emails depuis Node.js
import nodemailer from "nodemailer";
// On importe et configure 'dotenv' pour charger les variables d'environnement depuis un fichier .env
import dotenv from "dotenv";
dotenv.config(); // Charge les variables d'environnement
// Création du transporteur d'e-mails avec nodemailer
// On configure ici le service SMTP utilisé (ici, Brevo ex-Sendinblue)
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com", // Adresse du serveur SMTP de Brevo
  port: 587, // Port recommandé pour le protocole SMTP avec STARTTLS
  secure: false,
  auth: {
    user: process.env.SMTP_USER as string, // Nom d'utilisateur, stocké dans le fichier .env
    pass: process.env.SMTP_PASSWORD as string, // Mot de passe, également stocké dans .env
  },
});

// On exporte le transporteur pour l'utiliser ailleurs dans l'application
export default transporter;

// On exporte le transporteur pour l'utiliser ailleurs dans l'application
