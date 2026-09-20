import Joi from "joi";

const createBookingSchema= Joi.object({
    checkIn: Joi.date().required().messages({
        "date.base": "Check-in date must be a valid date",
        "any.required": "Check-in date is required"
    }),
    checkOut: Joi.date().greater(Joi.ref("checkIn")).required().messages({
        "date.base": "Check-out date must be a valid date",
        "date.greater": "Check-out date must be after check-in date",
        "any.required": "Check-out date is required"
    }),
    roomsNumber: Joi.number().integer().min(1).required().messages({
        "number.base": "Number of rooms must be a number",
        "number.min": "Number of rooms must be at least 1",
        "any.required": "Number of rooms is required"
    }),
    guestsNumber: Joi.number().integer().min(1).required().messages({
        "number.base": "Number of guests must be a number",
        "number.min": "Number of guests must be at least 1",
        "any.required": "Number of guests is required"
    })
})

export default createBookingSchema