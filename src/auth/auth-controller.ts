import { Router } from "express";
import { forgetPassword, login, signup } from "./auth-service";

export const AuthRouter = Router();

AuthRouter.post("/signup", signup);

AuthRouter.post("/signin", login);

AuthRouter.post("forget-password", forgetPassword);
