import Joi from "joi";

const createHotelsSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .required()
        .messages({
        "string.min": "Hotel name must be at least 3 characters long",
        "string.max": "Hotel name cannot exceed 50 characters",
        "string.empty": "Hotel name is required",
        "any.required": "Hotel name is required",
        }),

    description: Joi.string()
        .trim()
        .min(10)
        .max(500)
        .required()
        .messages({
        "string.min": "Hotel description must be at least 10 characters long",
        "string.max": "Hotel description cannot exceed 500 characters",
        "string.empty": "Hotel description is required",
        "any.required": "Hotel description is required",
        }),

    address: Joi.string()
        .trim()
        .min(5)
        .max(200)
        .required()
        .messages({
        "string.min": "Hotel address must be at least 5 characters long",
        "string.max": "Hotel address cannot exceed 200 characters",
        "string.empty": "Hotel address is required",
        "any.required": "Hotel address is required",
        }),

    location: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .required()
        .messages({
        "string.min": "Hotel location must be at least 3 characters long",
        "string.max": "Hotel location cannot exceed 50 characters",
        "string.empty": "Hotel location is required",
        "any.required": "Hotel location is required",
        }),

    images: Joi.array()
        .items(Joi.string())
        .default([]),
});

const updateHotelSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .optional()
        .messages({
        "string.min": "Hotel name must be at least 3 characters long",
        "string.max": "Hotel name cannot exceed 50 characters",
        "string.empty": "Hotel name is required",
        "any.required": "Hotel name is required",
        }),
    description: Joi.string()
        .trim()
        .min(10)
        .max(500)
        .optional()
        .messages({
        "string.min": "Hotel description must be at least 10 characters long",
        "string.max": "Hotel description cannot exceed 500 characters",
        "string.empty": "Hotel description is required",
        "any.required": "Hotel description is required",
    }),
    address: Joi.string()
        .trim()
        .min(5)
        .max(200)
        .optional()
        .messages({
        "string.min": "Hotel address must be at least 5 characters long",
        "string.max": "Hotel address cannot exceed 200 characters",
        "string.empty": "Hotel address is required",
        "any.required": "Hotel address is required",
        }),
    location: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .optional()
        .messages({
        "string.min": "Hotel location must be at least 3 characters long",
        "string.max": "Hotel location cannot exceed 50 characters",
        "string.empty": "Hotel location is required",
        "any.required": "Hotel location is required",
        }),
    images: Joi.array()
        .items(Joi.string())
        .optional()
});

export { createHotelsSchema, updateHotelSchema };