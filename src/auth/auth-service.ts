import { NextFunction, Request, Response } from "express";
import {
  createUser,
  decodeResetPasswordToken,
  findUserWithEmail,
  modifyUserPassword,
  sendPasswordResetMail,
  signinUser,
} from "../user/user-service";
import * as bcrypt from "bcrypt";
import { EMAIL_PATTERN } from "../util/data";
import { ContactUs } from "./contact-us-schema";

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const { firstName, lastName, emailAddress, password } = req.body;

    if (!firstName || !lastName || !emailAddress || !password)
      return res.status(400).json({
        message: "Invalid data provided",
        status: 400,
      });

    const user = await createUser(firstName, lastName, emailAddress, password);

    if (!user)
      return res.status(200).json({
        message: "Error creating user, please try again later.",
        status: 200,
      });

    const response = Object.assign(user.toObject(), {
      message:
        "User created successfully, please verify your account then login.",
      status: 201,
    });
    res.status(response.status).json(response);
  } catch (err: any) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { emailAddress, password } = req.body;
    const user = await findUserWithEmail(emailAddress);
    if (!user)
      return res.status(400).json({
        message: "Invalid email address or password provided.",
        status: 400,
      });

    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).json({
        message: "Invalid email address or password provided.",
        status: 400,
      });

    res.status(200).json(signinUser(user.toObject()));
  } catch (err: any) {
    next(err);
  }
}

export function forgetPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email: emailAddress } = req.params;
    if (!emailAddress.match(EMAIL_PATTERN))
      return res
        .status(400)
        .json({ message: "Invalid data provided.", status: 400 });

    sendPasswordResetMail(
      emailAddress,
      req.headers.location || "http://localhost:3000/"
    );

    res.status(200).json({
      message:
        "A password reset mail has been sent to the provided email address.",
      status: 200,
    });
  } catch (err: any) {
    next(err);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const resetToken = decodeResetPasswordToken(token);

    if (
      !password ||
      password.length < 7 ||
      !resetToken.emailAddress.match(EMAIL_PATTERN)
    )
      return res
        .status(400)
        .json({ message: "Invalid data provided.", status: 400 });

    const modifiedUser = await modifyUserPassword(
      resetToken.emailAddress,
      password
    );

    if (!modifiedUser)
      return res.status(200).json({
        message: "Error modifying user's password. please try again later.",
        status: 200,
      });
    res
      .status(201)
      .json({ message: "User password modified successfully.", status: 201 });
  } catch (err: any) {
    next(err);
  }
}

export async function contactUs(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { firstName, lastName, phoneNumber, emailAddress, message } =
      req.body;

    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      phoneNumber.length < 10 ||
      !emailAddress.match(EMAIL_PATTERN) ||
      !message
    )
      return res
        .status(400)
        .json({ message: "Incomplete or invalid data provided", status: 400 });

    await new ContactUs({
      firstName,
      lastName,
      phoneNumber,
      emailAddress,
      message,
    }).save();
    res
      .status(201)
      .json({ message: "Thank you for contacting us", status: 200 });
  } catch (err: any) {
    console.error(err);
    next(err);
  }
}
