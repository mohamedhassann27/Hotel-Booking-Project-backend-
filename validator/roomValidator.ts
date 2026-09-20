import Joi from "joi";

const createRoomSchema= Joi.object({
    name: Joi.string().trim().min(3).required().messages({
        "string.min": "Room name must be at least 3 characters long",
        "required": "Room name is required",
    }),
    description: Joi.string().trim().min(6).required().messages({
        "string.min": "Room description must be at least 6 characters long",
        "required": "Room description is required",
    }),
    type: Joi.string().valid("single", "double", "suite", "family").required().messages({
        "any.only": "Room type must be one of 'single', 'double', 'suite', or 'family'",
        "required": "Room type is required"
    }),
    price: Joi.number().min(0).required().messages({
        "number.min": "Room price must be at least 0",
        "required": "Room price is required",
    }),
    capacity: Joi.number().min(1).required().messages({
        "number.min": "Room capacity must be at least 1",
        "required": "Room capacity is required",
    }),
    quantity: Joi.number().min(1).required().messages({
        "number.min": "Room quantity must be at least 1",
        "required": "Room quantity is required",
    }),
    images: Joi.array().items(Joi.string()).default([]),
})

const updateRoomSchema= Joi.object({
    name: Joi.string().trim().min(3).messages({
        "string.min": "Room name must be at least 3 characters long",
    }),
    description: Joi.string().trim().min(6).messages({
        "string.min": "Room description must be at least 6 characters long",
    }),
    type: Joi.string().valid("single", "double", "suite", "family").messages({
        "any.only": "Room type must be one of 'single', 'double', 'suite', or 'family'",
    }),
    price: Joi.number().min(0).messages({
        "number.min": "Room price must be at least 0",
    }),
    capacity: Joi.number().min(1).messages({
        "number.min": "Room capacity must be at least 1",
    }),
    quantity: Joi.number().min(1).messages({
        "number.min": "Room quantity must be at least 1",
    }),
    images: Joi.array().items(Joi.string()).default([]),
})

export {createRoomSchema, updateRoomSchema}