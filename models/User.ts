import mongoose from "mongoose";

const UserSchema= new mongoose.Schema({
        name:{
            type: String,
            required: [true, "name is required"],
            trim: true,
            lowercase: true,
            minlength: [3, "name must be at least 3 characters long"],
            maxlength: [30, "name must be at most 30 characters long"]
        },
        email:{
            type: String,
            required: [true, "email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            index: true, // Create an index on the email field for faster queries
        },
        password: {
            type: String,
            required: [true, "password is required"],
            minlength: [5, "password must be at least 5 characters long"],
            trim: true,
            select: false
        },
        phone: {
            type: String,
            trim: true,
        },
        nationality:{
            type: String,
            trim: true,
        },
        role: {
            type: String,
            enum: ["customer", "manager", "admin"],
            default: "customer", 
            index: true
        },
        isActive:{
            type: Boolean,
            default: true
        }
    },
    {timestamps: true}
)

const User= mongoose.model("User", UserSchema)

export default User