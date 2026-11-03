import type { Request, Response } from "express";
import User from "../models/User.js";

class userController{

    async getUserById(req: Request, res: Response) {
        const userId = req.params.userId;
        const user= await User.findById(userId).select("-password")
        if(!user){
            return res.status(404).json({success: false, message: "User not found"})
        }
        return res.status(200).json({success: true, message: "User retrieved successfully", data: user})
    }

    async updateUserById(req: Request, res: Response) {
        const userId = req.params.userId;
        const updatedUserData= req.body
        const user= await User.findByIdAndUpdate(userId, updatedUserData, {new: true}).select("-password")
        if(!user){
            return res.status(404).json({success: false, message: "User not found"})
        }
        return res.status(200).json({success: true, message: "User updated successfully", data: user})
    }
}

export default new userController()