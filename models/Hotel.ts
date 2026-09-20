import mongoose from "mongoose";

const hotelSchema= new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Hotel name is required"],
        trim: true,
        minLength: [3, "Hotel name must be at least 3 characters long"],
        maxLength: [50, "Hotel name must be at most 50 characters long"],
        // unique: [true, "Hotel name must be unique"],
        index: true 
    },
    description: {
        type: String,
        required: [true, "Hotel description is required"],
        trim: true,
        minLength: [10, "Hotel description must be at least 10 characters long"],
        maxLength: [500, "Hotel description must be at most 500 characters long"]
    },
    address: {
        type: String,
        required: [true, "Hotel address is required"],
        trim: true,
    },
    location: {
        type: String,
        required: [true, "Hotel location is required"],
        trim: true
    },
    images: {
        type: [String],
        default: []
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Hotel owner is required"],
    },
    rating: {
        type: Number,
        default: 0,
        min: [0, "Rating must be at least 0"],
        max: [5, "Rating must be at most 5"]
    },
    reviewCount:{
        type: Number,
        default: 0,
        min: [0, "Review count must be at least 0"]
    },
    status: {
        type: String,
        enum: ["pending", "active","suspended", "rejected"],
        default: "pending"
    }
},
    {timestamps: true}
)

const Hotel= mongoose.model("Hotel", hotelSchema)

export default Hotel