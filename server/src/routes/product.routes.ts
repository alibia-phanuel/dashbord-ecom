import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';

const router = Router();

 router.get('/getAllProducts', getAllProducts);
 router.get('/getProduct/:id', getProductById);
 router.post('/create', createProduct);
 router.put('/update/:id', updateProduct);
router.delete('/delete/:id', deleteProduct);

export default router;
