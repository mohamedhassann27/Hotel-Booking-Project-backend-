import { Router } from "express";
import userController from "../controller/userController.js";

const userRouter= Router()
userRouter.get("/:userId", userController.getUserById)
userRouter.patch("/:userId", userController.updateUserById)

export default userRouter