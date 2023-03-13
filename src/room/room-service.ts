import { NextFunction, Request, Response } from "express";
import { Room } from "./room-schema";

export async function addRoom(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      roomType,
      packageName,
      roomName,
      adult: adultStr,
      children: childrenStr,
      bed,
      price: priceStr,
      capacity: capacityStr,
      view,
      services,
      size: sizeStr,
    } = req.body;

    if (
      !roomType ||
      !packageName ||
      !roomName ||
      !adultStr ||
      !childrenStr ||
      !bed ||
      !priceStr
    )
      return res
        .status(400)
        .json({ massage: "Incomplete or invalid data provided.", status: 400 });

    const adult = Number(adultStr);
    const children = Number(childrenStr);
    const price = Number(priceStr);
    const capacity = Number(capacityStr);
    const size = Number(sizeStr);

    await new Room({
      roomType,
      roomName,
      packageName,
      adult,
      children,
      bed,
      price,
      capacity: capacity || null,
      view: view || null,
      services: services || null,
      size: size || null,
    }).save();

    res.status(201).json({ message: "Room saved successfully", status: 201 });
  } catch (err: any) {
    if (err.code === 11000)
      return next(Error("Room name is already in use.:::400"));

    console.log(err);
    next(err);
  }
}

export async function getRooms(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const page = Number(req.query.page) || 0;
    const packageName = req.query.packageName || null;
    const roomType = req.query.roomType || null;
    const roomName = req.query.roomName || null;

    res.status(200).json({
      rooms: await Room.find({ packageName, roomType, roomName })
        .limit(10)
        .skip(page),
      status: 200,
    });
  } catch (err: any) {
    console.log(err);
    next(err);
  }
}
