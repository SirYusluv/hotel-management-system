import { Router } from "express";
import { getEvaluation, submitEvaluation } from "./user-service";

export const UserRouter = Router();

UserRouter.post("/evaluation", submitEvaluation);

// can receive query param of emailAddress?, all?: "true" | "false", page?
UserRouter.get("/get-evaluation", getEvaluation);
