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
exports.getUserData = void 0;
const userClient_model_1 = __importDefault(require("../models/userClient.model"));
const getUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req; // ou `req.userId` si tu étends les types Express
        const user = yield userClient_model_1.default.findOne({ where: { id: userId } });
        if (!user) {
            res.json({ success: false, messageKey: "userNotFound" }); // ✅ clé i18n
            return;
        }
        res.json({
            success: true,
            userData: {
                id: user.id,
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.json({ success: false, messageKey: "internalError" }); // ✅ fallback i18n
    }
});
exports.getUserData = getUserData;
