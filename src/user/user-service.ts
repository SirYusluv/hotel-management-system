import { EMAIL_PATTERN } from "../util/data";
import { IUser, User } from "./user-schema";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { NextFunction, Request, Response } from "express";
import { Evaluation } from "./evaluation-schema";

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

export function decodeBearerToken(token: string) {
  try {
    const verifiedToken: IJwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as IJwtPayload;
    return verifiedToken;
  } catch (err: any) {
    throw new Error("Error verifying token.:::400");
  }
}

export async function submitEvaluation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      checkInDate,
      checkOutDate,
      firstTime,
      firstName,
      lastName,
      emailAddress,
      phone,
      frontDeskOfficePerformance,
      staffPerformance,
      spaPerformance,
      roomsPerformance,
      resturantPerformance,
      fitnessCenterPerformance,
      overallPerformance,
    } = req.body;
    const { _user }: { _user: IJwtPayload } = req.body;
    const userId = new Types.ObjectId(_user._id);

    const frontDeskOfficePerformanceNum = Number(frontDeskOfficePerformance);
    const staffPerformanceNum = Number(staffPerformance);
    const spaPerformanceNum = Number(spaPerformance);
    const roomsPerformanceNum = Number(roomsPerformance);
    const resturantPerformanceNum = Number(resturantPerformance);
    const fitnessCenterPerformanceNum = Number(fitnessCenterPerformance);
    const overallPerformanceNum = Number(overallPerformance);

    if (!checkInDate || !checkOutDate || !firstTime)
      return res
        .status(400)
        .json({ message: "Incomplete data provided.", status: 400 });

    const performanceIsNotValid = (performance: number) =>
      performance < 1 || performance > 5;

    if (
      (firstName && firstName.length < 1) ||
      (lastName && lastName.length < 1) ||
      (emailAddress && !emailAddress.match(EMAIL_PATTERN)) ||
      (phone && phone.length < 10) ||
      !["yes", "no"].includes(firstTime) ||
      performanceIsNotValid(frontDeskOfficePerformanceNum) ||
      performanceIsNotValid(staffPerformanceNum) ||
      performanceIsNotValid(spaPerformanceNum) ||
      performanceIsNotValid(roomsPerformanceNum) ||
      performanceIsNotValid(resturantPerformanceNum) ||
      performanceIsNotValid(fitnessCenterPerformanceNum) ||
      performanceIsNotValid(overallPerformanceNum)
    )
      return res
        .status(400)
        .json({ message: "Incomplete or invalid data provided.", status: 400 });

    const convCheckInDate = new Date(checkInDate); // converted
    const convCheckOutDate = new Date(checkOutDate);

    const evaluation = new Evaluation({
      user: userId,
      checkInDate: convCheckInDate,
      checkOutDate: convCheckOutDate,
      firstTime,
      firstName,
      lastName,
      emailAddress: emailAddress || _user.emailAddress,
      phone,
      frontDeskOfficePerformance,
      staffPerformance,
      spaPerformance,
      roomsPerformance,
      resturantPerformance,
      fitnessCenterPerformance,
      overallPerformance,
    });
    await evaluation.save();

    res
      .status(201)
      .json({ message: "Thanks for the evaluation.", status: 201 });
  } catch (err: any) {
    console.log(err);
    next(err);
  }
}

export async function getEvaluation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { emailAddress: unConvertedEmail, all: unConvertedAll } = req.query;
    const emailAddress = unConvertedEmail?.toString();
    const all = unConvertedAll?.toString();

    const page = Number(req.params.page) || 0;

    if (
      (emailAddress && !emailAddress.match(EMAIL_PATTERN)) ||
      (all && !["true", "false"].includes(all))
    )
      return res
        .status(400)
        .json({ message: "Invalid data provided", status: 400 });

    let evaluations: any[] = [];

    // I'm not converting all to boolean in "if" cause I don't want any truty to work Boolean("any value")
    if (!emailAddress && (!all || all === "false")) {
      evaluations = await Evaluation.find().limit(1).skip(page);
    }

    if (!emailAddress && all === "true") {
      evaluations = await Evaluation.find().limit(10).skip(page);
    }

    if (emailAddress && (!all || all === "false")) {
      evaluations = await Evaluation.find({ emailAddress }).limit(1).skip(page);
    }

    if (emailAddress && all === "true") {
      evaluations = await Evaluation.find({ emailAddress })
        .limit(10)
        .skip(page);
    }

    res.status(200).json({ evaluations, status: 200 });
  } catch (err: any) {
    console.log(err);
    next(err);
  }
}
