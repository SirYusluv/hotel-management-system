import { model, Schema } from "mongoose";

export interface IUser {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
}

export const userSchema = new Schema<IUser>({
  firstName: { required: true, type: String },
  lastName: { required: true, type: String },
  emailAddress: { required: true, unique: true, type: String },
  password: { required: true, type: String, minlength: 7, select: 0 },
});

export const User = model<IUser>("User", userSchema);
