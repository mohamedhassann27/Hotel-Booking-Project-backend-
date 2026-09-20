import mongoose from "mongoose";

const roomSchema= new mongoose.Schema({
        name:{
            type: String,
            trim: true,
            minLength: [3, "Room name must be at least 3 characters long"],
            required: [true, "Room name is required"],
            // index: true
        },
        description:{
            type: String,
            trim: true,
            minLength: [6, "Room description must be at least 6 characters long"],
            required: [true, "Room description is required"]
        },
        hotel:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel",
            required: [true, "Room must belong to a hotel"],
            index: true
        },
        type:{
            type: String,
            enum: ["single", "double", "suite", "family"],
            required: [true, "Room type is required"],
        },
        price:{
            type: Number,
            required: [true, "Room price is required"],
            min: [0, "Room price must be at least 0"]
        },
        capacity: {
            type: Number,
            required: [true, "Room capacity is required"],
            min: [1, "Room capacity must be at least 1"],
            default: 1
        },
        quantity:{
            type: Number,
            required: [true, "Room quantity is required"],
            min: [1, "Room quantity must be at least 1"],
            default: 1
        },
        images:{
            type: [String],
            default: []
        },
    },
    {timestamps: true}
)

const Room= mongoose.model("Room", roomSchema)

export default Room