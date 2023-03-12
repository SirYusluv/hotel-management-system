import { NextFunction, Request, Response } from "express";
import { user } from "./user/user-schema";
import {
  decodeBearerToken,
  findUserWithEmail,
  IJwtPayload,
} from "./user/user-service";

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

export async function adminGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { _user }: { _user: IJwtPayload } = req.body;
    if (!_user)
      return res.status(401).json({
        message: "You are not authorized to access this resource",
        status: 401,
      });

    const userData = await findUserWithEmail(_user.emailAddress);

    if (userData?.userType !== user.admin)
      return res.status(401).json({
        message: "You are not authorized to access this resource",
        status: 401,
      });
    next();
  } catch (err: any) {
    console.error(err);
    next(err);
  }
}
