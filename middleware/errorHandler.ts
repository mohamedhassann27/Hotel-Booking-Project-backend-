import type { NextFunction, Request, Response } from "express";

const errorHandler= (err: any, req:Request, res:Response, next: NextFunction)=>{
    let statusCode= err.statusCode || 500
    let message= err.message || "Internal Server Error"

    if(err.name === "CastError"){
        statusCode= 400
        // message= `Invalid Id format: ${err.value}`
        message= `Invalid ${err.path}: ${err.value}`
        
    }
    if(err.isJoi){
        statusCode= 400
        message= err.details.map((detail: any)=> detail.message).join(", ")
    }
    if(err.name === "ValidationError"){
        statusCode= 400
        message= Object.values(err.errors).map((value: any)=> value.message).join(", ")
    }
    if(err.code ===11000){
        statusCode= 409
        message= `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`
    }
    if(err.name === "JsonWebTokenError"){
        statusCode= 401
        message= "Invalid token"
    }
    if(err.name === "TokenExpiredError"){
        statusCode= 401
        message= "Token has expired"
    }

    return res.status(statusCode).json({success: false, message})
}

export default errorHandler