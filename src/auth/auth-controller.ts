import { Router } from "express";
import {
  addUserToNewsletter,
  contactUs,
  forgetPassword,
  login,
  resetPassword,
  signup,
} from "./auth-service";

export const AuthRouter = Router();

AuthRouter.post("/signup", signup);

AuthRouter.post("/signin", login);

AuthRouter.get("/forget-password/:email", forgetPassword);

AuthRouter.post("/reset-password/:token", resetPassword);

AuthRouter.post("/contact-us", contactUs);

AuthRouter.post("/newsletter", addUserToNewsletter);
