import { Router } from "express";
import { adminGuard } from "../guard";
import {
  removeBookedRoom,
  addRoom,
  bookRoom,
  getRooms,
  updateRoom,
  getBookedRooms,
} from "./room-service";

export const RoomRouter = Router();

RoomRouter.post("/add-room", adminGuard, addRoom);

// can take query param: roomId page, packageName, roomType, roomName, adult, children, price
// if roomId is provided, it is advisible not to provide any other query param since there can be only 1 match for id
RoomRouter.get("/rooms", getRooms);

// takes roomName: string and data: object in body
// data contains any of room property except roomName
// roomName can't be changed
RoomRouter.patch("/room", adminGuard, updateRoom);

RoomRouter.post("/book-room", bookRoom);

RoomRouter.delete("/remove-room/:roomId", removeBookedRoom);

// query param: page?
RoomRouter.get("/room", getBookedRooms);
