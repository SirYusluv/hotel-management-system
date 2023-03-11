import { EMAIL_PATTERN } from "../util/data";
import { IUser, User } from "./user-schema";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { HydratedDocument, Types } from "mongoose";

export interface IJwtPayload {
  emailAddress: string;
  _id: string;
  [key: string]: string;
}

export interface IResetPassword {
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

export function signinUser(userWithPassword: IUser & { _id: Types.ObjectId }) {
  const { password: _, ...user } = userWithPassword;
  try {
    const jwtPayload: IJwtPayload = {
      emailAddress: user.emailAddress,
      _id: user._id.toString(),
    };

    Object.assign(user, {
      accessToken: jwt.sign(jwtPayload, process.env.JWT_SECRET!),
    });
    return user;
  } catch (err: any) {
    console.log(err);
    throw err;
  }
}

export function sendPasswordResetMail(emailAddress: string, homeURL: string) {
  const emailReset: IResetPassword = { emailAddress };
  const resetToken = jwt.sign(emailReset, process.env.RESET_PASSWORD_SECRET!);

  if (!homeURL.endsWith("/")) homeURL = homeURL + "/";

  // INFO: send the password reset mail

  console.log(`${homeURL}auth/reset-password/${resetToken}`);
}

export function decodeResetPasswordToken(token: string) {
  try {
    const verifiedToken: IResetPassword = jwt.verify(
      token,
      process.env.RESET_PASSWORD_SECRET!
    ) as IResetPassword;
    return verifiedToken;
  } catch (err: any) {
    throw new Error("Error verifying token.:::400");
  }
}

export async function modifyUserPassword(
  emailAddress: string,
  newPassword: string
) {
  try {
    const user = await findUserWithEmail(emailAddress);
    if (!user) throw new Error("User with the data provided not found.:::400");

    user.password = await bcrypt.hash(newPassword, 12);
    return user.save();
  } catch (err: any) {
    console.log(err);
    throw new Error("Error modifying user's data.:::400");
  }
}
