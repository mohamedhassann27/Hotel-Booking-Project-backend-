import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from "express"
import User from '../models/User.js';
import appError from './appError.js';
import type mongoose from 'mongoose';


// for TypeScript to recognize the user property on the Request object, we need to extend the Express Request interface. This is done by declaring a global namespace and adding the user property to the Request interface.
declare global {
    namespace Express {
        interface Request {
            user?: {id: mongoose.Types.ObjectId, role: string};
        }
    }
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(appError("Unauthorized access", 401))
    }
    const token = authHeader.split(" ")[1]
    if (!token) {
        return next(appError("Unauthorized access", 401))
    }
    const secret = process.env.ACCESS_TOKEN_SECRET
    if (!secret) {
        return next(appError("Server configuration error", 500))
    }
    try {
        const decoded = jwt.verify(token, secret) as { id: string, role: string }
        const user = await User.findById(decoded.id)
        if (!user) {
            return next(appError("User not found", 404))
        }
        req.user = { id: user._id, role: user.role}
        next()
    } catch (err) {
        next(err)
    }
}

export default auth