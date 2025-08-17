import multer from 'multer';
import path from 'path';

// Configuration du stockage : on sauvegarde les fichiers dans le dossier 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // dossier où sont enregistrées les images
  },
  filename: (req, file, cb) => {
    // Génère un nom unique : timestamp + extension originale
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Filtrage des fichiers pour n'accepter que les images
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5 Mo
});
