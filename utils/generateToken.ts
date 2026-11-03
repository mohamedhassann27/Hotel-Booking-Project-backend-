// import type { ObjectId } from "mongoose";
import jwt from "jsonwebtoken";
import type mongoose from "mongoose";

const generateAccessToken = (user: {_id: mongoose.Types.ObjectId, role: string}) => {
    const {_id, role} = user;
    // const token= jwt.sign({id: _id.toString(), role}, process.env.ACCESS_TOKEN_SECRET as string, {expiresIn: "15m"})
    const token= jwt.sign({id: _id.toString(), role}, process.env.ACCESS_TOKEN_SECRET as string)
    return token;
}



const generateRefreshToken = (user: {_id: mongoose.Types.ObjectId, role: string}) => {
    const {_id, role} = user;
    const token= jwt.sign({id: _id.toString(), role}, process.env.REFRESH_TOKEN_SECRET as string, {expiresIn: "30d"})
    return token;
}

export {generateAccessToken, generateRefreshToken}