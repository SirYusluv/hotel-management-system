import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const app = express();

const port = process.env.PORT || 3000;

app.listen(port, function () {
  mongoose.connect(process.env.MONGODB_URI);
});
