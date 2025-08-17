import e, { Request, Response } from "express";
import Userclient from "../models/userClient.model";

export const getUserData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req as any; // ou `req.userId` si tu étends les types Express
    const user = await Userclient.findOne({ where: { id: userId } });

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
  } catch (error) {
    console.error(error);
    res.json({ success: false, messageKey: "internalError" }); // ✅ fallback i18n
  }
};
