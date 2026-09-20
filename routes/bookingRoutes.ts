import { Router } from "express";
import auth from "../middleware/auth.js";
import bookingController from "../controller/bookingController.js";
import authorize from "../middleware/authorize.js";

const bookingRoutes= Router({mergeParams: true})

bookingRoutes.post("/hotels/:hotelId/rooms/:roomId", auth, bookingController.createBooking)
bookingRoutes.get("/my", auth, authorize("customer"), bookingController.getMyBookings)
bookingRoutes.get("/my/:bookingId", auth, authorize("customer"), bookingController.getMyBookingById)
bookingRoutes.patch("/my/:bookingId", auth, authorize("customer"), bookingController.cancelMyBooking)

bookingRoutes.get("/hotels/:hotelId", auth, authorize("manager", "admin"), bookingController.getHotelBookings)
bookingRoutes.patch("/hotels/:hotelId/:bookingId", auth, authorize("manager"), bookingController.updateBookingStatus)


export default bookingRoutes