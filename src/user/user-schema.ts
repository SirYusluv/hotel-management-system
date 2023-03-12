import { model, Schema } from "mongoose";

export type userType = "admin" | "user";
export const user = { user: "user", admin: "admin" };

export interface IUser {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  userType?: userType;
}

export const userSchema = new Schema<IUser>({
  firstName: { required: true, type: String },
  lastName: { required: true, type: String },
  emailAddress: { required: true, unique: true, type: String },
  password: { required: true, type: String, minlength: 7, select: 0 },
  userType: { required: false, type: String, default: user.user },
});

export const User = model<IUser>("User", userSchema);
