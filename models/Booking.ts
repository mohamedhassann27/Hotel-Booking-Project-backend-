import mongoose from "mongoose";

const bookingSchema= new mongoose.Schema(
    {
        customer:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Booking must belong to a user"],
            index: true
        },
        hotel:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel",
            required: [true, "Booking must belong to a hotel"],
            index: true
        },
        room:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: [true, "Booking must belong to a room"],
            index: true
        },
        pricePerNight: {
            type: Number,
            required: [true, "Booking price is required"],
            min: [0, "Booking price cannot be negative"]
        },
        totalPrice: {
            type: Number,
            required: [true, "Total price is required"],
            min: [0, "Total price cannot be negative"]
        },
        checkIn:{
            type: Date,
            required: [true, "Check-in date is required"],
        },
        checkOut:{
            type: Date,
            required: [true, "Check-out date is required"],
        },
        roomsNumber:{
                type: Number,
                min: [1, "There must be at least 1 room booked"],
                required: [true, "Number of rooms booked is required"],
        },
        guestsNumber:{
            type: Number,
            required: [true, "Number of guests is required"],
            min: [1, "There must be at least 1 guest"]
        },
        status:{
            type: String,
            enum: ["pending", "confirmed", "cancelled", "completed"],
            required: [true, "Booking status is required"],
            default: "pending"
        },
    }, {timestamps: true}
)

const Booking= mongoose.model("Booking", bookingSchema)

export default Booking