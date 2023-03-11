import { NextFunction, Request, Response } from "express";
import {
  createUser,
  findUserWithEmail,
  IResetEmail,
  sendPasswordResetMail,
  signinUser,
} from "../user/user-service";
import * as bcrypt from "bcrypt";
import { EMAIL_PATTERN } from "../util/data";

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

export function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.params;
    const resetToken: IResetEmail = decodeResetEmail();
  } catch (err: any) {
    next(err);
  }
}
