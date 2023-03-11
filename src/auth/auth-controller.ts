import { Router } from "express";
import { forgetPassword, login, resetPassword, signup } from "./auth-service";

export const AuthRouter = Router();

AuthRouter.post("/signup", signup);

AuthRouter.post("/signin", login);

AuthRouter.get("/forget-password/:email", forgetPassword);

AuthRouter.get("/reset-password/:token", resetPassword);
