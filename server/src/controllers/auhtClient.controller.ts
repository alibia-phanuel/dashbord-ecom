import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Userclient from "../models/userClient.model";
import transporter from "../config/nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, messageKey: "missingDetails" });
      return;
    }

    const existingUser = await Userclient.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ success: false, messageKey: "userExists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Userclient.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });

    const { password: _, ...userData } = user.get({ plain: true });

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

    await transporter.sendMail(mailOptions);

    res
      .status(201)
      .json({ success: true, userData, messageKey: "registrationSuccess" });
  } catch (error: any) {
    console.error("❌ Erreur dans register:", error);

    // En cas d'erreur serveur, on renvoie un messageKey cohérent
    res.status(500).json({
      success: false,
      messageKey: "internalError",
    });
  }
};
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        messageKey: "missingDetails",
      });
      return;
    }

    const user = await Userclient.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({
        success: false,
        messageKey: "invalidEmail",
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        messageKey: "invalidPassword",
      });
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
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
  } catch (error: any) {
    console.error("❌ Erreur dans Login:", error);
    res.status(500).json({
      success: false,
      messageKey: "internalError",
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
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
  } catch (error: any) {
    console.error("❌ Erreur dans logout:", error);
    res.status(500).json({
      success: false,
      messageKey: "logoutError",
    });
  }
};

// Envoi de l'OTP de vérification à l'adresse électronique de l'utilisateur
export const sendVerifyOtp = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.body;

    const user = await Userclient.findOne({ where: { id: userId } });

    if (user?.isAccountVerified) {
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

    await user?.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user?.email,
      subject: "🎉 Vérification du compte OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 16px;">
          <h2 style="color: #3b82f6;">Your OTP is ${otp} 👋</h2>
          <p>Vérifiez votre compte à l'aide de cet OTP</p>
          <p>— L'équipe Alibia</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email envoyé:", info);

    res.json({
      success: true,
      messageKey: "otpSent",
      email: user?.email,
    });
  } catch (error) {
    console.error("❌ Erreur lors de l’envoi de l’OTP :", error);
    res.status(500).json({
      success: false,
      messageKey: "otpSendError",
    });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { id, otp } = req.body;

  if (!id || !otp) {
    res.status(400).json({ success: false, messageKey: "missingDetails" });
    return;
  }

  try {
    const user = await Userclient.findOne({ where: { id } });

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
    await user.save();

    res.status(200).json({ success: true, messageKey: "accountVerified" });
    return;
  } catch (error) {
    console.error("❌ Erreur lors de la vérification de l’OTP :", error);
    res.status(500).json({
      success: false,
      messageKey: "otpVerificationError",
    });
  }
};
//Check if user authentificated
export const isAuthentificated = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    res.status(200).json({ success: true });
    return;
  } catch (error: any) {
    res.json({ success: false, message: error.message });
  }
};

//send Password Reset OPT
export const sendResetOtp = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ success: false, message: "missingDetails" });
    return;
  }

  try {
    const user = await Userclient.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ success: false, message: "userNotFound" });
      return;
    }

    const otp = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");

    if (user) {
      user.resetOtp = otp;
      user.resetOtpExpireAt = (Date.now() + 25 * 60 * 1000).toString(); // 25 minutes
    }

    await user?.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user?.email,
      subject: "🔐 OTP de réinitialisation de mot de passe",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 16px;">
          <h2 style="color: #3b82f6;">Votre OTP est ${otp}</h2>
          <p>Utilisez cet OTP pour réinitialiser votre mot de passe.</p>
          <p>— L'équipe Alibia</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email envoyé:", info);

    res.status(200).json({
      success: true,
      message: "otpSent",
    });
  } catch (error) {
    console.error("Erreur lors de l’envoi de l’OTP :", error);
    res.status(500).json({
      success: false,
      message: "otpSendError",
    });
  }
};

//Reset User Password

// Contrôleur pour réinitialiser le mot de passe à partir de l'email, OTP, et nouveau mot de passe
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      res.status(400).json({
        success: false,
        messageKey: "missingResetDetails",
      });
      return;
    }

    const user = await Userclient.findOne({ where: { email } });

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

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = "0";

    await user.save();

    res.status(200).json({
      success: true,
      messageKey: "passwordResetSuccess",
    });
  } catch (error) {
    console.error("❌ Erreur dans resetPassword:", error);
    res.status(500).json({
      success: false,
      messageKey: "internalError",
    });
  }
};
