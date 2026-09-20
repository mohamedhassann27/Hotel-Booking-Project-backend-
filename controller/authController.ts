import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
// import bcrypt from "bcryptjs";
import bcrypt from "bcrypt"
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import appError from '../middleware/appError.js';
import { loginSchema, registerSchema } from '../validator/userValidator.js';

class authController{

    async register(req:Request, res: Response, next: NextFunction){
        const {name, email, password}= req.body
        // joi validation
        const {error, value} = registerSchema.validate({name, email, password})
        if(error){
            // const err= new Error(error.details[0]?.message)
            // err.statusCode= 400
            // return next(err) 

            //{---appError function is used to create a custom error object with a message and status code instead of creating Error object in all cases---}

            return next(appError(error.details[0]?.message as string, 400))
        }
        try{
            const existingUser= await User.findOne({email: value.email})
            if(existingUser){
                return next(appError("User already exists", 409))
            }
            const hashedPassword= await bcrypt.hash(value.password, 10)
            const newUser= await User.create({name: value.name, email: value.email, password: hashedPassword})
            res.status(201).json({success: true, message: "User registered successfully", data: {name: newUser.name, email: newUser.email, phone: newUser.phone, role: newUser.role}})
        }catch(err){
            next(err)
        }
    }

    async login(req:Request, res: Response, next: NextFunction){
        const {email, password}= req.body
        const {error, value}= loginSchema.validate({email, password})
        if(error){
            return next(appError(error.details[0]?.message as string, 400))
        }
        try{
            const existingUser= await User.findOne({email: value.email}).select("+password")
            if(!existingUser){
                return next(appError("Invalid email or password", 401))
            }
            const isPasswordValid= await bcrypt.compare(value.password, existingUser.password)
            if(!isPasswordValid){
                return next(appError("Invalid email or password", 401))
            }
            const accessToken= generateAccessToken(existingUser)
            const refreshToken= generateRefreshToken(existingUser)
    
            res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: true, sameSite: "none"})
    
            return res.status(200).json({success: true, message: "User logged in successfully", user: {id: existingUser._id, name: existingUser.name, email: existingUser.email, phone: existingUser.phone, role: existingUser.role}, accessToken})
        }catch(err){
            next(err)
        }
    }

    async refreshToken(req:Request, res: Response, next: NextFunction){
        const refreshToken= req.cookies.refreshToken
        if(!refreshToken){
            return next(appError("Refresh token not found", 401))
        }
        try{
            const decoded= jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as {id: string, role: string}
            const user= await User.findById(decoded.id)
            if(!user){
                return next(appError("User not found", 404))
            }
            const accessToken= generateAccessToken(user)
            res.status(200).json({success: true, message:"access token refreshed successfully", accessToken})
        }catch(err){
            next(err)
        }
    }

}

export default new authController()