"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auhtClient_controller_1 = require("../controllers/auhtClient.controller");
const userClientAuth_1 = __importDefault(require("../middlewares/userClientAuth"));
const authClientRouter = express_1.default.Router();
authClientRouter.post("/register", auhtClient_controller_1.register);
authClientRouter.post("/login", auhtClient_controller_1.login);
authClientRouter.post("/logout", auhtClient_controller_1.logout);
authClientRouter.post("/send-verify-otp", userClientAuth_1.default, auhtClient_controller_1.sendVerifyOtp);
authClientRouter.post("/verify-account", userClientAuth_1.default, auhtClient_controller_1.verifyEmail);
authClientRouter.get("/is-auth", userClientAuth_1.default, auhtClient_controller_1.isAuthentificated);
authClientRouter.post("/send-reset-otp", auhtClient_controller_1.sendResetOtp);
authClientRouter.post("/reset-password", auhtClient_controller_1.resetPassword);
exports.default = authClientRouter;
