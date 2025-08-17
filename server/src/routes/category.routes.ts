import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";

const router = Router();

router.get("/getAllCategories", getAllCategories);
router.get("/getCategory/:id", getCategoryById);
router.post("/create", createCategory);
router.put("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);

export default router;
