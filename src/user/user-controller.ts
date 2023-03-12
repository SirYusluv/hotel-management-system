import { Router } from "express";
import { submitEvaluation } from "./user-service";

export const UserRouter = Router();

UserRouter.post("/evaluation", submitEvaluation);
