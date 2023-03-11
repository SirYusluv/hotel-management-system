import { EMAIL_PATTERN } from "../util/data";
import { IUser, User } from "./user-schema";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Types } from "mongoose";

export interface IJwtPayload {
  emailAddress: string;
  _id: string;
  [key: string]: string;
}

export interface IResetEmail {
  emailAddress: string;
}

export async function createUser(
  firstName: string,
  lastName: string,
  emailAddress: string,
  password: string
) {
  try {
    if (
      firstName.length < 1 ||
      lastName.length < 1 ||
      !emailAddress.match(EMAIL_PATTERN) ||
      password.length < 7
    )
      throw new Error("Invalid data provided.:::400");

    return await new User({
      firstName,
      lastName,
      emailAddress,
      password: await bcrypt.hash(password, 12),
    }).save();
  } catch (err: any) {
    if (err.code === 11000) {
      throw new Error("Email address is already in use.:::400");
    }

    console.error(err);
    throw err;
  }
}

export async function findUserWithEmail(emailAddress: string) {
  try {
    return await User.findOne({ emailAddress }).populate("password");
  } catch (err: any) {
    console.log(err);
    throw err;
  }
}

export async function signinUser(
  userWithPassword: IUser & { _id: Types.ObjectId }
) {
  const { password: _, ...user } = userWithPassword;
  try {
    const jwtPayload: IJwtPayload = {
      emailAddress: user.emailAddress,
      _id: user._id.toString(),
    };

    return Object.assign(user, {
      accessToken: jwt.sign(jwtPayload, process.env.JWT_SECRET!),
    });
  } catch (err: any) {
    console.log(err);
    throw err;
  }
}

export function sendPasswordResetMail(emailAddress: string, homeURL: string) {
  const emailReset: IResetEmail = { emailAddress };
  const resetToken = jwt.sign(emailReset, process.env.RESET_EMAIL_SECRET!);

  if (!homeURL.endsWith("/")) homeURL = homeURL + "/";

  // INFO: send the password reset mail

  console.log(`${homeURL}auth/reset-password/${resetToken}`);
}

export function decodeResetEmailToken(token: string) {
  try {
    const verifiedToken = jwt.verify(token, process.env.RESET_EMAIL_SECRET!);
    console.log(verifiedToken);
  } catch (err: any) {
    throw new Error("Error verifying token.:::400");
  }
}
