import { Router } from 'express';
import { addImages, getImages, deleteImage } from '../controllers/productImage.controller';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// Ajouter plusieurs images à un produit
 router.post('/:id/images', upload.array('images', 5), addImages);

// Lister les images d’un produit
router.get('/:id/images', getImages);

// Supprimer une image d’un produit
router.delete('/:id/images/:imgId', deleteImage);

export default router;
