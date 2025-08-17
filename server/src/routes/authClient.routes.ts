import express from "express";
import {
  register,
  login,
  logout,
  sendVerifyOtp,
  verifyEmail,
  isAuthentificated,
  sendResetOtp,
  resetPassword,
} from "../controllers/auhtClient.controller";
import userClientAuth from "../middlewares/userClientAuth";
const authClientRouter = express.Router();

authClientRouter.post("/register", register);
authClientRouter.post("/login", login);

authClientRouter.post("/logout", logout);
authClientRouter.post("/send-verify-otp", userClientAuth, sendVerifyOtp);
authClientRouter.post("/verify-account", userClientAuth, verifyEmail);
authClientRouter.get("/is-auth", userClientAuth, isAuthentificated);
authClientRouter.post("/send-reset-otp", sendResetOtp);
authClientRouter.post("/reset-password", resetPassword);

export default authClientRouter;
