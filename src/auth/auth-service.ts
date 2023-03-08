import { NextFunction, Request, Response } from "express";
import { createUser } from "../user/user-service";

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

export function login(req: Request, res: Response, next: NextFunction) {}

export function forgetPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {}
