"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userClientAuth_1 = __importDefault(require("../middlewares/userClientAuth"));
const userClient_controller_1 = require("../controllers/userClient.controller");
const userClientRouter = express_1.default.Router();
userClientRouter.get("/data", userClientAuth_1.default, userClient_controller_1.getUserData);
exports.default = userClientRouter;
