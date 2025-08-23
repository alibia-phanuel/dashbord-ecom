import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";

const router = express.Router();
router.get("/getAllUsers", getAllUsers);
router.get("/getUser/:id", getUserById);
router.post("/create", createUser);
router.patch("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);
export default router;
