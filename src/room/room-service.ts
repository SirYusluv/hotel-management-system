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
      capacity,
      view,
      services,
      size,
    }).save();

    res.status(201).json({ message: "Room saved successfully", status: 201 });
  } catch (err: any) {
    console.log(err);
    next(err);
  }
}
