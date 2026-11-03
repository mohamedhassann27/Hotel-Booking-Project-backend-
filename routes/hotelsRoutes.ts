import { Router } from "express";
import hotelsController from "../controller/hotelsController.js";
import auth from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";

const hotelsRouter= Router()

// hotelsRouter.get("/", auth, hotelsController.getAllHotels)
hotelsRouter.get("/", hotelsController.getAllHotels)
hotelsRouter.get("/:id", auth, hotelsController.getHotelById)
// hotelsRouter.post("/", auth,authorize("admin"), hotelsController.createHotel)
hotelsRouter.post("/", auth, hotelsController.createHotel)
// hotelsRouter.patch("/:id", auth, authorize("admin", "manager"), hotelsController.updateHotel)
hotelsRouter.patch("/:id", auth, hotelsController.updateHotel)
// hotelsRouter.delete("/:id", auth, authorize("admin", "manager"), hotelsController.deleteHotel)
hotelsRouter.delete("/:id", auth, hotelsController.deleteHotel)

export default hotelsRouter