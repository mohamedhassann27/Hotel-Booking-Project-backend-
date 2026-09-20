import { type NextFunction, type Request, type Response } from "express";
import appError from "../middleware/appError.js";
import mongoose from "mongoose";
import Room from "../models/Room.js";
import createBookingSchema from "../validator/bookingValidator.js";
import Booking from "../models/Booking.js";
import type { TCreateBooking } from "../types/booking.js";
import type Joi from "joi";
import Hotel from "../models/Hotel.js";

class bookingController {

    async createBooking(req: Request, res: Response, next: NextFunction){
        const {hotelId, roomId}= req.params
        if(typeof hotelId!=="string" || !mongoose.Types.ObjectId.isValid(hotelId)){
            return next(appError("Invalid hotel id", 400))
        }
        if(typeof roomId!=="string" || !mongoose.Types.ObjectId.isValid(roomId)){
            return next(appError("Invalid room id", 400))
        }
        const {error, value}= createBookingSchema.validate(req.body) as {error?: Joi.ValidationError, value: TCreateBooking}
        if(error){
            return next(appError(`Validation error: ${error.message}`, 400))
        }
        try{
            const room= await Room.findOne({_id: roomId, hotel: hotelId})
            if(!room){
                return next(appError("Room not found", 404))
            }
            const checkInTime= value.checkIn.getTime()
            const checkOutTime= value.checkOut.getTime()
            if(checkInTime >= checkOutTime){
                return next(appError("Check-out date must be after check-in date", 400))
            }
            if(value.guestsNumber > room.capacity*value.roomsNumber){
                return next(appError(`Number of guests exceeds room capacity (${room.capacity * value.roomsNumber})`, 400))
            }
            const overLappingBookings= await Booking.find({
                room: roomId,
                status: {$in: ["pending", "confirmed"]},
                checkIn: {$lt: value.checkOut},
                checkOut: {$gt: value.checkIn}
            })
            const totalRoomsBooked= overLappingBookings.reduce((total, booking)=>total+ booking.roomsNumber, 0)
            const availableRooms= room.quantity - totalRoomsBooked
            if(availableRooms< value.roomsNumber){
                return next(appError("Number of rooms exceeds available quantity",400))
            }

            const nights= (checkOutTime - checkInTime) / (1000 * 60 * 60 * 24)
            const pricePerNight= room.price
            const totalPrice= pricePerNight * nights * value.roomsNumber

            const booking= await Booking.create({
                customer: req.user!.id,
                hotel: hotelId,
                room: roomId,
                pricePerNight,
                totalPrice,
                status: "pending",
                ...value
            })
            res.status(201).json({success: true, message: "Booking created successfully", data: booking})
        }catch(err){
            next(err)
        }
    }

    async getMyBookings(req: Request, res: Response, next: NextFunction){
        const customerId= req.user!.id
        try{
            const bookings= await Booking.find({customer: customerId}).populate("hotel").populate("room").sort("-createdAt")
            res.status(200).json({success: true, message: "Bookings retrieved successfully", data: bookings})
        }catch(err){
            next(err)
        }
    }
    
    async getMyBookingById(req: Request, res: Response, next: NextFunction){
        const customerId= req.user!.id
        const bookingId= req.params.bookingId
        if(typeof bookingId!=="string" || !mongoose.Types.ObjectId.isValid(bookingId)){
            return next(appError("Invalid booking id", 400))
        }
        try{
            const booking= await Booking.findOne({_id: bookingId, customer: customerId}).populate("hotel", "name location images").populate("room", "named type price images")
            if(!booking){
                return next(appError("Booking not found", 404))
            }
            res.status(200).json({success: true, message: "Booking retrieved successfully", data: booking})
        }catch(err){
            next(err)
        }
    }
    
    async cancelMyBooking(req: Request, res: Response, next: NextFunction){
        const {bookingId}= req.params
        const customerId= req.user!.id
        if(typeof bookingId!=="string" || !mongoose.Types.ObjectId.isValid(bookingId)){
            return next(appError("Invalid booking id", 400))
        }
        try{
            const booking= await Booking.findOne({_id: bookingId, customer: customerId})
            if(!booking){
                return next(appError("Booking not found", 404))
            }
            if(booking.status === "cancelled"){
                return next(appError("Booking is already cancelled", 400))
            }
            if(booking.status === "completed"){
                return next(appError("Completed booking cannot be cancelled", 400))
            }
            booking.status= "cancelled"
            await booking.save()
            res.status(200).json({success: true, message: "Booking cancelled successfully", data: booking})
        }catch(err){
            next(err)
        }
    }

    async getHotelBookings(req: Request, res: Response, next: NextFunction){
        const {hotelId}= req.params
        const userId= req.user!.id
        if(typeof hotelId!=="string" || !mongoose.Types.ObjectId.isValid(hotelId)){
            return next(appError("Invalid hotel id", 400))
        }
        try{
            const hotel= await Hotel.findById(hotelId)
            if(!hotel){
                return next(appError("Hotel not found", 404))
            }
            if(hotel.owner.toString() !== userId.toString()){
                return next(appError("You are not owner of this hotel", 403))
            }
            const bookings= await Booking.find({hotel: hotelId}).populate("customer", "name email").populate("room", "named type price").sort("-createdAt")
            res.status(200).json({success: true, message: "Bookings retrieved successfully", data: bookings})
        }catch(err){
            next(err)
        }
    }

    async updateBookingStatus(req: Request, res: Response, next: NextFunction){
        const {hotelId, bookingId}= req.params
        const userId= req.user!.id
        const {status}= req.body
        if(typeof status!=="string" || !["confirmed", "cancelled", "completed"].includes(status)){
            return next(appError("Invalid status", 400))
        }
        if(typeof hotelId!=="string" || !mongoose.Types.ObjectId.isValid(hotelId)){
            return next(appError("Invalid hotel id", 400))
        }
        if(typeof bookingId!=="string" || !mongoose.Types.ObjectId.isValid(bookingId)){
            return next(appError("Invalid booking id", 400))
        }
        try{
            const hotel= await Hotel.findById(hotelId)
            if(!hotel){
                return next(appError("Hotel not found", 404))
            }
            if(hotel.owner.toString()!==userId.toString()){
                return next(appError("You are not owner of this hotel", 403))
            }
            const booking= await Booking.findOne({_id: bookingId, hotel: hotelId})
            if(!booking){
                return next(appError("Booking not found", 404))
            }
            booking.status= status as "confirmed" | "cancelled" | "completed"
            await booking.save()
            res.status(200).json({success: true, message: "Booking status updated successfully", data: booking})
        }catch(err){
            next(err)
        }
    }

    // async getBookingById(req: Request, res: Response, next: NextFunction){
    //     const {bookingId}= req.params
    //     const userId= req.user!.id
    //     if(typeof bookingId!=="string" || !mongoose.Types.ObjectId.isValid(bookingId)){
    //         return next(appError("Invalid booking id", 400))
    //     }
    //     try{
    //         const booking= await Booking.findById(bookingId).populate("customer", "name email").populate("hotel", "name location").populate("room", "named type price")
    //         if(!booking){
    //             return next(appError("Booking not found", 404))
    //         }
    //         res.status(200).json({success: true, message: "Booking retrieved successfully", data: booking})
    //     }catch(err){
    //         next(err)
    //     }
    // }
}

export default new bookingController()