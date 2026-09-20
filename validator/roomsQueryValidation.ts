import Joi from "joi";

const roomsQuerySchema= Joi.object({
    page: Joi.number().integer().min(1).max(100).default(1).messages({
        "number.base": "Page number must be a number",
        "number.integer": "Page number must be an integer",
        "number.min": "Page number must be at least 1",
        "number.max": "Page number cannot exceed 100"
    }),
    limit: Joi.number().integer().min(1).max(100).default(10).messages({
        "number.base": "Limit must be a number",
        "number.integer": "Limit must be an integer",
        "number.min": "Limit must be at least 1",
        "number.max": "Limit cannot exceed 100"

    }),
    sort: Joi.string().valid("name", "-name", "price", "-price", "capacity", "-capacity", "createdAt", "-createdAt").default("-createdAt"), //(-createdAt)last added
    search: Joi.string().trim().max(50).default(""),
})

export default roomsQuerySchema