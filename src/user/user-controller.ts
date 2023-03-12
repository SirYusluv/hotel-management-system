import { Router } from "express";
import { adminGuard } from "../guard";
import {
  getContactUs,
  getEvaluation,
  getNewsLetter,
  submitEvaluation,
} from "./user-service";

export const UserRouter = Router();

UserRouter.post("/evaluation", submitEvaluation);

// can receive query param of emailAddress?, all?: "true" | "false", page?
UserRouter.get("/get-evaluation", getEvaluation);

// receive query param of page?: number
UserRouter.get("/contact-us", adminGuard, getContactUs);

UserRouter.get("/newsletter", adminGuard, getNewsLetter);
