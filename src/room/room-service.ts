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
    const adult = Number(req.query.adult) || null;
    const children = Number(req.query.children) || null;
    const price = Number(req.query.price) || null;

    res.status(200).json({
      rooms: await Room.find({
        packageName: packageName || { $regex: /.*?/ },
        roomType: roomType || { $regex: /.*?/ },
        roomName: roomName || { $regex: /.*?/ },
        adult: adult || { $gt: -1 },
        children: children || { $gt: -1 },
        price: price || { $gt: -1 },
      })
        .limit(10)
        .skip(page),
      status: 200,
    });
  } catch (err: any) {
    console.log(err);
    next(err);
  }
}

export async function updateRoom(
  req: Request,
  res: Response,
  next: NextFunction
) {
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

    const adult = Number(adultStr);
    const children = Number(childrenStr);
    const price = Number(priceStr);
    const capacity = Number(capacityStr);
    const size = Number(sizeStr);

    if (!roomName)
      return res
        .status(400)
        .json({ message: "Room name nust be provided.", status: 400 });

    if (
      !roomType &&
      !packageName &&
      !adult &&
      !children &&
      !bed &&
      !price &&
      !capacity &&
      !view &&
      !services &&
      !size
    )
      return res
        .status(400)
        .json({ message: "Incomplete or invalid data provided.", status: 400 });

    const room = await Room.findOne({ roomName });
    if (!room)
      return res.status(400).json({
        message: `Room with name ${roomName} does not exist.`,
        status: 400,
      });

    room.roomType = roomType || room.roomType;
    room.packageName = packageName || room.packageName;
    room.adult = adult || room.adult;
    room.children = children || room.children;
    room.bed = bed || room.bed;
    room.price = price || room.price;
    room.capacity = capacity || room.capacity;
    room.view = view || room.view;
    room.services = services || room.services;
    room.size = size || room.size;
    room.save();

    res
      .status(200)
      .json({ room, message: "Room updated successfully.", status: 201 });
  } catch (err: any) {
    console.log(err);
    next(err);
  }
}
