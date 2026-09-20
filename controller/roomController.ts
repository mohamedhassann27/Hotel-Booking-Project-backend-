import type { NextFunction, Request, Response } from "express";
import { createRoomSchema, updateRoomSchema } from "../validator/roomValidator.js";
import appError from "../middleware/appError.js";
import Room from "../models/Room.js";
import roomsQuerySchema from "../validator/roomsQueryValidation.js";
import mongoose from "mongoose";
import Hotel from "../models/Hotel.js";

class roomController{

    async createRoom(req: Request, res: Response, next: NextFunction){
        const {hotelId}= req.params
        if(!hotelId || typeof hotelId !== "string" || !mongoose.Types.ObjectId.isValid(hotelId)){
            return next(appError("Invalid hotel id", 400))
        }
        try{
            const hotel= await Hotel.findById(hotelId)
            if(!hotel){
                return next(appError("Hotel not found", 404))
            }
            if(hotel.owner.toString() !== req.user!.id.toString()){
                return next(appError("You are not authorized to create rooms for this hotel", 403))
            }
            const newRoom= req.body
            const {error, value}= createRoomSchema.validate(newRoom)
            if(error){
                return next(appError(error.message, 400))
            }
        
            const isRoomExist= await Room.findOne({name: value.name, hotel: hotelId})
            if(isRoomExist){
                return next(appError("Room already exists", 409))
            }
            const room= await Room.create({...value, hotel: hotelId})
            return res.status(201).json({success: true, message: "Room created successfully", data: room})
        }catch(err){
            next(err)
        }
    }

    async getAllRooms(req: Request, res: Response, next: NextFunction){
        const {hotelId}= req.params
        if(!hotelId || typeof hotelId !== "string" || !mongoose.Types.ObjectId.isValid(hotelId)){
            return next(appError("Invalid hotel id", 400))
        }
        try{
            const hotel= await Hotel.findById(hotelId)
            if(!hotel){
                return next(appError("Hotel not found", 404))
            }
            // if(hotel.owner.toString()!== req.user!.id.toString()){
            //     return next(appError("You are not authorized to view rooms of this hotel", 403))
            // }

            const {error, value}= roomsQuerySchema.validate(req.query)
            if(error){
                return next(appError(error.message, 400))
            }
            const page= Number(value.page) || 1
            const limit= Number(value.limit) || 10
            const skip= (page - 1) * limit
            const sort= value.sort 
            const search= value.search
            const searchFilter= search ? {name: {$regex: search, $options: "i"}} : {} 
            const totalRooms= await Room.countDocuments({hotel: hotelId, ...searchFilter})
            const totalPages= Math.ceil(totalRooms / limit)
            const rooms= await Room.find({hotel: hotelId, ...searchFilter}).skip(skip).limit(Number(limit)).sort(sort).populate("hotel")
            res.status(200).json({success: true, message: "Rooms retrieved successfully", data: rooms, pagination: {page, limit, totalRooms, totalPages}})
        }catch(err){
            next(err)
        }
    }

    async getRoomById(req: Request, res: Response, next: NextFunction){
        const {roomId, hotelId}= req.params
        if(typeof roomId !== "string" || !mongoose.Types.ObjectId.isValid(roomId)){
            return next(appError("Invalid room id", 400))
        }  
        if(typeof hotelId !== "string" || !mongoose.Types.ObjectId.isValid(hotelId)){
            return next(appError("Invalid hotel id", 400))
        }
        try{
            const hotel= await Hotel.findById(hotelId)
            if(!hotel){
                return next(appError("Hotel not found", 404))
            }
            const room= await Room.findOne({_id: roomId, hotel: hotelId}).populate("hotel")
            if(!room){
                return next(appError("Room not found", 404))
            }
            res.status(200).json({success: true, message: "Room retrieved successfully", data: room})
        }catch(err){
            next(err)
        }
    }

    async updateRoom(req: Request, res: Response, next: NextFunction){
        const {roomId, hotelId}= req.params      
        if(typeof roomId !== "string" || !mongoose.Types.ObjectId.isValid(roomId)){
            return next(appError("Invalid room id", 400))
        }
        if(typeof hotelId !== "string" || !mongoose.Types.ObjectId.isValid(hotelId)){
            return next(appError("Invalid hotel id", 400))
        }
        const updatedRoomData= req.body
        const{error, value}= updateRoomSchema.validate(updatedRoomData)
        if(error){
            return next(appError(error.message, 400))
        }
        try{
            const hotel= await Hotel.findById(hotelId)
            if(!hotel){
                return next(appError("Hotel not found", 404))
            }
            if(hotel.owner.toString()!==req.user!.id.toString()){
                return next(appError("You are not owner of this hotel", 403))
            }
            const room= await Room.findOne({_id:roomId, hotel: hotelId})
            if(!room){
                return next(appError("Room not found", 404))
            }
            Object.assign(room, value)
            const updatedRoom= await room.save()

            res.status(200).json({success: true, message: "Room udated successfully", data: updatedRoom})
        }catch(err){
            next(err)
        }
    }

    async deleteRoom(req: Request, res: Response, next: NextFunction){
        const {roomId, hotelId}= req.params
        if(typeof roomId !== "string" || !mongoose.Types.ObjectId.isValid(roomId)){
            return next(appError("Invalid room id", 400))
        }
        if(typeof hotelId !== "string" || !mongoose.Types.ObjectId.isValid(hotelId)){
            return next(appError("Invalid hotel id", 400))
        }
        try{
            const hotel= await Hotel.findById(hotelId)
            if(!hotel){
                return next(appError("Hotel not found", 404))
            }
            if(hotel.owner.toString()!==req.user!.id.toString()){
                return next(appError("You are not owner of this hotel", 403))
            }
            const room= await Room.findOne({_id: roomId, hotel: hotelId})
            if(!room){
                return next(appError("Room not found", 404))
            }
            await room.deleteOne()
            res.status(200).json({success: true, message: "Room deleted successfully"})
        }catch(err){
            next(err)
        }
    }
}

export default new roomController()