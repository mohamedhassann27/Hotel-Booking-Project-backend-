import Joi from "joi";

const registerSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .max(30)
        .required()
        .messages({
        "string.min": "Name must be at least 3 characters long",
        "string.max": "Name must be at most 30 characters long",
        "string.empty": "Name is required",
        "any.required": "Name is required",
        }),

    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required()
        .messages({
        "string.email": "Invalid email format",
        "string.empty": "Email is required",
        "any.required": "Email is required",
        }),

    password: Joi.string()
        .min(5)
        .max(100)
        .required()
        .messages({
        "string.min": "Password must be at least 5 characters long",
        "string.max": "Password must be at most 100 characters long",
        "string.empty": "Password is required",
        "any.required": "Password is required",
        }),

    phone: Joi.string()
        .trim()
        .optional(),
    });

    const loginSchema = Joi.object({
    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required()
        .messages({
        "string.email": "Invalid email format",
        "string.empty": "Email is required",
        "any.required": "Email is required",
        }),

    password: Joi.string()
        .required()
        .messages({
        "string.empty": "Password is required",
        "any.required": "Password is required",
        }),
});

export { registerSchema, loginSchema };