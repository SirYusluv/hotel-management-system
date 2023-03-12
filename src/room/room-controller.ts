import { Router } from "express";
import { adminGuard } from "../guard";
import { addRoom } from "./room-service";

export const RoomRouter = Router();

RoomRouter.post("/add-room", adminGuard, addRoom);
