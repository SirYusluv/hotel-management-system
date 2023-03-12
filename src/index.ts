import * as dotenv from "dotenv";
import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import mongoose from "mongoose";
import { AuthRouter } from "./auth/auth-controller";
import { userGuard } from "./guard";
import { RoomRouter } from "./room/room-controller";
import { UserRouter } from "./user/user-controller";
dotenv.config({ path: `.env.${process.env.NODE_ENV!}` });

const app = express();
app.use(express.json());
app.use("/auth", AuthRouter);
app.use("/user", userGuard, UserRouter);
app.use("/room", userGuard, RoomRouter);

const errorHandler: ErrorRequestHandler = function (
  err: any,
  _: Request,
  res: Response,
  _1: NextFunction
) {
  let resMsg;

  if (err.message && (err.message as string).includes(":::")) {
    let [message, status] = err.message.split(":::");
    status = Number(status);
    resMsg = { ...err, message, status };
  }

  if (!resMsg)
    resMsg = {
      message: "Error processing your request, please try later.",
      status: 500,
    };
  res.status(resMsg.status).json(resMsg);
};
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, function () {
  mongoose.connect(process.env.MONGODB_URI!);
});
