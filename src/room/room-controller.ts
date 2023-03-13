import { Router } from "express";
import { adminGuard } from "../guard";
import { addRoom, getRooms, updateRoom } from "./room-service";

export const RoomRouter = Router();

RoomRouter.post("/add-room", adminGuard, addRoom);

// can take query param: page, packageName, roomType, roomName, adult, children, price
RoomRouter.get("/rooms", getRooms);

// takes roomName: string and data: object in body
// data contains any of room property except roomName
// roomName can't be changed
RoomRouter.patch("/room", adminGuard, updateRoom);
