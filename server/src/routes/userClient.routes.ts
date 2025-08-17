import express from "express";
import userClientAuth from "../middlewares/userClientAuth";
import { getUserData } from "../controllers/userClient.controller";

const userClientRouter = express.Router();
userClientRouter.get("/data", userClientAuth, getUserData);

export default userClientRouter;
