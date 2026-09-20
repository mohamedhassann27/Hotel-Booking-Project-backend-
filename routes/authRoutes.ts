import { Router } from "express";
import authController from "../controller/authController.js";
import auth from "../middleware/auth.js";

const authRoutes= Router()

authRoutes.post("/register", authController.register)
authRoutes.post("/login", authController.login)
authRoutes.post("/refresh", auth, authController.refreshToken)

export default authRoutes