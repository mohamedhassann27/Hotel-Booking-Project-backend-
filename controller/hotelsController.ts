import type { ObjectId } from "mongoose";
import Hotel from "../models/Hotel.js"
import type { NextFunction, Request, Response } from "express";
import appError from "../middleware/appError.js";
import mongoose from "mongoose";
import type { TCreateHotel, THotel } from "../types/hotel.js";
import hotelsQueryValidator from "../validator/hotelsQueryValidator.js";
import User from "../models/User.js";
import { createHotelsSchema, updateHotelSchema } from "../validator/hotelValidator.js";

class hotelsController{

    async getAllHotels(req:Request, res:Response, next:NextFunction){
        const {page, limit, sort, search, rate}= req.query
        const {error, value}= hotelsQueryValidator.validate({page, limit, sort, search, rate})
        if(error){
            return next(appError(error.details[0]?.message as string, 400))
        }
        try{
            const pageNumber= value.page
            const limitNumber= value.limit
    
            const skip= (pageNumber - 1) * limitNumber

            let filter:Record<string, unknown>= {}
            if(value.search) filter.name={$regex: value.search, $options: "i"} // case-insensitive search
            if(value.rate) filter.rating={$gte: value.rate} // filter hotels with rating greater than or equal to the specified rate

            // const hotels= await Hotel.find().skip(skip).limit(limitNumber).sort(value.sort).populate("owner");
            const hotels= await Hotel.find(filter).skip(skip).limit(limitNumber).sort(value.sort).populate("owner");

            const totalHotels= await Hotel.countDocuments();
            const totalPages= Math.ceil(totalHotels / limitNumber)
    
            res.status(200).json({
                success: true, 
                message: "Hotels retrieved successfully", 
                data: hotels, 
                pagination:{
                    page: pageNumber,
                    limit: limitNumber,
                    totalPages,
                    totalHotels
                }
            });
        }catch(err){
            next(err)
        }
    }

    async getHotelById(req:Request, res:Response, next:NextFunction){
        const {id}= req.params
        if(typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)){
            return next(appError("Invalid hotel id", 400))
        }
        try{
            const hotel= await Hotel.findById(id).populate("owner")
            if(!hotel){
                return next(appError("Hotel not found", 404))
            }
            return res.status(200).json({success: true, message: "Hotel retrieved successfully", data: hotel})
        } catch (error) {
            next(error)
        }
    }

    async createHotel(req:Request, res:Response, next:NextFunction){
        const hotelData: TCreateHotel= req.body
        const {error, value}= createHotelsSchema.validate(hotelData)
        if(error){
            return next(appError(error.details[0]?.message as string, 400))
        }
        try{
            const existingHotel= await Hotel.findOne({name: value.name})
            if(existingHotel){
                return next(appError("Hotel already exists", 409))
            }
            // const manager= await User.findById(value.manager)
            const newHotel= await Hotel.create({...value, owner: req.user!.id})
            res.status(201).json({success: true, message: "Hotel created successfully", hotel: newHotel})
        }catch(err){
            next(err)
        }
    }

    async updateHotel(req:Request, res:Response, next:NextFunction){
        const {id}= req.params
        if( typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)){
            return next(appError("Invalid hotel id", 400))
        }
        const hotelData: THotel= req.body
        const {error, value}= updateHotelSchema.validate(hotelData)
        if(error){
            return next(appError(error.details[0]?.message as string, 400))
        }
        try{
            const hotel= await Hotel.findById(id)
            if(!hotel){
                return next(appError("Hotel not found", 404))
            }

            if(hotel.owner.toString() !== req.user!.id.toString()){
                console.log("Hotel owner:", hotel.owner, "Request user id:", req.user!.id)
                return next(appError("You are not authorized to update this hotel", 403))
            }

            const updatedHotel= await Hotel.findByIdAndUpdate(id, value, {new: true})
            return res.status(200).json({success: true, message: "Hotel updated successfully", data: updatedHotel})
        }catch(err){
            return next(err)
        }
    }

    async deleteHotel(req:Request, res:Response, next:NextFunction){
        const {id}= req.params
        if( typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)){
            return next(appError("Invalid hotel id", 400))
        }
        try{
            const deletedHotel= await Hotel.findByIdAndDelete(id)
            if(!deletedHotel){
                next(appError("Hotel not found", 404))
            }
            return res.status(200).json({success: true, message: "Hotel deleted successfully", hotel: deletedHotel})
        }catch(err){
            next(err)
        }
    }

}
export default new hotelsController()