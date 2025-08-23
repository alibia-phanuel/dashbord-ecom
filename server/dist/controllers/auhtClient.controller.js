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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.sendResetOtp = exports.isAuthentificated = exports.verifyEmail = exports.sendVerifyOtp = exports.logout = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userClient_model_1 = __importDefault(require("../models/userClient.model"));
const nodemailer_1 = __importDefault(require("../config/nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ success: false, messageKey: "missingDetails" });
            return;
        }
        const existingUser = yield userClient_model_1.default.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ success: false, messageKey: "userExists" });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield userClient_model_1.default.create({
            name,
            email,
            password: hashedPassword,
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
        });
        const _a = user.get({ plain: true }), { password: _ } = _a, userData = __rest(_a, ["password"]);
        // Envoi de l’email de bienvenue
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "🎉 Bienvenue chez Alibia !",
            html: `
        <div style="font-family: Arial, sans-serif; padding: 16px;">
          <h2 style="color: #3b82f6;">Bienvenue ${name} 👋</h2>
          <p>Merci de rejoindre notre plateforme ! Nous sommes ravis de vous accueillir.</p>
          <p style="margin-top: 20px;">🚀 L'aventure commence maintenant !</p>
          <p>— L'équipe Alibia</p>
        </div>
      `,
        };
        yield nodemailer_1.default.sendMail(mailOptions);
        res
            .status(201)
            .json({ success: true, userData, messageKey: "registrationSuccess" });
    }
    catch (error) {
        console.error("❌ Erreur dans register:", error);
        // En cas d'erreur serveur, on renvoie un messageKey cohérent
        res.status(500).json({
            success: false,
            messageKey: "internalError",
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                messageKey: "missingDetails",
            });
            return;
        }
        const user = yield userClient_model_1.default.findOne({ where: { email } });
        if (!user) {
            res.status(401).json({
                success: false,
                messageKey: "invalidEmail",
            });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                messageKey: "invalidPassword",
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({
            success: true,
            messageKey: "loginSuccess",
        });
    }
    catch (error) {
        console.error("❌ Erreur dans Login:", error);
        res.status(500).json({
            success: false,
            messageKey: "internalError",
        });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });
        res.status(200).json({
            success: true,
            messageKey: "logoutSuccess",
        });
    }
    catch (error) {
        console.error("❌ Erreur dans logout:", error);
        res.status(500).json({
            success: false,
            messageKey: "logoutError",
        });
    }
});
exports.logout = logout;
// Envoi de l'OTP de vérification à l'adresse électronique de l'utilisateur
const sendVerifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const user = yield userClient_model_1.default.findOne({ where: { id: userId } });
        if (user === null || user === void 0 ? void 0 : user.isAccountVerified) {
            res.json({
                success: false,
                messageKey: "accountAlreadyVerified",
            });
            return;
        }
        const otp = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");
        if (user) {
            user.verifyOtp = otp;
            user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        }
        yield (user === null || user === void 0 ? void 0 : user.save());
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user === null || user === void 0 ? void 0 : user.email,
            subject: "🎉 Vérification du compte OTP",
            html: `
        <div style="font-family: Arial, sans-serif; padding: 16px;">
          <h2 style="color: #3b82f6;">Your OTP is ${otp} 👋</h2>
          <p>Vérifiez votre compte à l'aide de cet OTP</p>
          <p>— L'équipe Alibia</p>
        </div>
      `,
        };
        const info = yield nodemailer_1.default.sendMail(mailOptions);
        console.log("📧 Email envoyé:", info);
        res.json({
            success: true,
            messageKey: "otpSent",
            email: user === null || user === void 0 ? void 0 : user.email,
        });
    }
    catch (error) {
        console.error("❌ Erreur lors de l’envoi de l’OTP :", error);
        res.status(500).json({
            success: false,
            messageKey: "otpSendError",
        });
    }
});
exports.sendVerifyOtp = sendVerifyOtp;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, otp } = req.body;
    if (!id || !otp) {
        res.status(400).json({ success: false, messageKey: "missingDetails" });
        return;
    }
    try {
        const user = yield userClient_model_1.default.findOne({ where: { id } });
        if (!user) {
            res.status(404).json({ success: false, messageKey: "userNotFound" });
            return;
        }
        if (user.verifyOtp !== otp) {
            res.status(400).json({ success: false, messageKey: "invalidOtp" });
            return;
        }
        if (Date.now() > user.verifyOtpExpireAt) {
            res.status(400).json({ success: false, messageKey: "otpExpired" });
            return;
        }
        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpireAt = 0;
        yield user.save();
        res.status(200).json({ success: true, messageKey: "accountVerified" });
        return;
    }
    catch (error) {
        console.error("❌ Erreur lors de la vérification de l’OTP :", error);
        res.status(500).json({
            success: false,
            messageKey: "otpVerificationError",
        });
    }
});
exports.verifyEmail = verifyEmail;
//Check if user authentificated
const isAuthentificated = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ success: true });
        return;
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
});
exports.isAuthentificated = isAuthentificated;
//send Password Reset OPT
const sendResetOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ success: false, message: "missingDetails" });
        return;
    }
    try {
        const user = yield userClient_model_1.default.findOne({ where: { email } });
        if (!user) {
            res.status(404).json({ success: false, message: "userNotFound" });
            return;
        }
        const otp = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");
        if (user) {
            user.resetOtp = otp;
            user.resetOtpExpireAt = (Date.now() + 25 * 60 * 1000).toString(); // 25 minutes
        }
        yield (user === null || user === void 0 ? void 0 : user.save());
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user === null || user === void 0 ? void 0 : user.email,
            subject: "🔐 OTP de réinitialisation de mot de passe",
            html: `
        <div style="font-family: Arial, sans-serif; padding: 16px;">
          <h2 style="color: #3b82f6;">Votre OTP est ${otp}</h2>
          <p>Utilisez cet OTP pour réinitialiser votre mot de passe.</p>
          <p>— L'équipe Alibia</p>
        </div>
      `,
        };
        const info = yield nodemailer_1.default.sendMail(mailOptions);
        console.log("📧 Email envoyé:", info);
        res.status(200).json({
            success: true,
            message: "otpSent",
        });
    }
    catch (error) {
        console.error("Erreur lors de l’envoi de l’OTP :", error);
        res.status(500).json({
            success: false,
            message: "otpSendError",
        });
    }
});
exports.sendResetOtp = sendResetOtp;
//Reset User Password
// Contrôleur pour réinitialiser le mot de passe à partir de l'email, OTP, et nouveau mot de passe
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            res.status(400).json({
                success: false,
                messageKey: "missingResetDetails",
            });
            return;
        }
        const user = yield userClient_model_1.default.findOne({ where: { email } });
        if (!user) {
            res.status(404).json({
                success: false,
                messageKey: "userNotFound",
            });
            return;
        }
        if (!user.resetOtp || user.resetOtp !== otp) {
            res.status(400).json({
                success: false,
                messageKey: "invalidOtp",
            });
            return;
        }
        const now = Date.now();
        if (parseInt(user.resetOtpExpireAt) < now) {
            res.status(400).json({
                success: false,
                messageKey: "expiredOtp",
            });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpireAt = "0";
        yield user.save();
        res.status(200).json({
            success: true,
            messageKey: "passwordResetSuccess",
        });
    }
    catch (error) {
        console.error("❌ Erreur dans resetPassword:", error);
        res.status(500).json({
            success: false,
            messageKey: "internalError",
        });
    }
});
exports.resetPassword = resetPassword;
