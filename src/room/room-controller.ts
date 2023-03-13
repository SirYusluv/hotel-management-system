import { Router } from "express";
import { adminGuard } from "../guard";
import { addRoom, getRooms } from "./room-service";

export const RoomRouter = Router();

RoomRouter.post("/add-room", adminGuard, addRoom);

// can take query param: page, packageName, roomType, roomName
RoomRouter.get("/rooms", getRooms);
