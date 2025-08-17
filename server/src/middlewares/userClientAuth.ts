// On importe la bibliothèque 'jsonwebtoken' pour gérer les tokens JWT et le type 'JwtPayload'.
import Jwt, { JwtPayload } from "jsonwebtoken";

// Middleware d'authentification pour vérifier si l'utilisateur est authentifié via un token JWT.
const userClientAuth = (req: any, res: any, next: any) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      success: false,
      messageKey: "required", // 👈 clé pour la traduction
    });
  }

  try {
    const tokenDecoded = Jwt.verify(token, process.env.JWT_SECRET as string);

    if ((tokenDecoded as JwtPayload).id) {
      req.userId = (tokenDecoded as JwtPayload).id;
    } else {
      return res.status(401).json({
        success: false,
        messageKey: "required",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      messageKey: "required",
    });
  }
};

// On exporte le middleware pour pouvoir l'utiliser dans d'autres fichiers de l'application.
export default userClientAuth;

//Check if user is authenticated
