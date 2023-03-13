import { model, Schema, Types } from "mongoose";

export interface IBookRoom {
  roomId: Types.ObjectId;
  userId: Types.ObjectId;
  emailAddress: string;
}

export const bookRoomSchema = new Schema<IBookRoom>({
  roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  emailAddress: { type: String, required: true },
});

export const BookRoom = model<IBookRoom>("BookRoom", bookRoomSchema);
