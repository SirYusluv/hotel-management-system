import { NextFunction, Request, Response } from "express";
import { decodeBearerToken } from "./user/user-service";

export async function userGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer: "))
      return res.status(400).json({
        message: "You are not authorized to access this resource.",
        status: 400,
      });

    const token = authorization.replace("Bearer: ", "");
    const decodedToken = decodeBearerToken(token);
    req.body._user = decodedToken;
    next();
  } catch (err: any) {
    /*INFO: Error that is not known shouldn't be shown to the user since there
    might be some things we don't want users to see expose in such error */
    console.error(err);
    next(err);
  }
}
