import type { NextFunction, Request, Response } from "express"
import appError from "./appError.js"

const authorize= (...roles: string[])=>{
    return (req : Request, res: Response, next: NextFunction)=>{
        if (!req.user) {
            return next(appError("Unauthorized access", 401));
        }
        if(!roles.includes(req.user.role )){
            // const error= new Error("Forbidden access")
            // error.statusCode= 403
            // return next(error)
            return next(appError("Forbidden access", 403))
        }
        next()
    }
}

export default authorize