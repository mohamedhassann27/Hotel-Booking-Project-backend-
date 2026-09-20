import { Router } from "express";
import roomController from "../controller/roomController.js";
import auth from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";

const roomRouter= Router({mergeParams: true})

roomRouter.get("/", auth, roomController.getAllRooms)
roomRouter.get("/:roomId", auth, roomController.getRoomById)
roomRouter.post("/", auth, authorize("manager"), roomController.createRoom)
roomRouter.delete("/:roomId", auth, authorize("manager"), roomController.deleteRoom)


export default roomRouter