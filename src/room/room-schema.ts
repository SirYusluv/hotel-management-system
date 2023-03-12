import { model, Schema } from "mongoose";

export interface IRoom {
  roomType: string;
  packageName: string;
  roomName: string;
  adult: number;
  children: number;
  bed: string;
  price: number;
  capacity?: number;
  view?: string;
  services?: string;
  size?: number;
}

export const roomSchema = new Schema<IRoom>({
  roomType: { type: String, required: true },
  packageName: { type: String, required: true },
  roomName: { type: String, required: true },
  adult: { type: Number, required: true },
  children: { type: Number, required: true },
  bed: { type: String, required: true },
  price: { type: Number, required: true },
  capacity: { type: Number, required: false },
  view: { type: String, required: false },
  services: { type: String, required: false },
  size: { type: Number, required: false },
});

export const Room = model<IRoom>("Room", roomSchema);
