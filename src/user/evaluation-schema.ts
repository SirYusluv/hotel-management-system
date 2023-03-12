import { model, Schema, Types } from "mongoose";

type firstTimeType = "yes" | "no";
type performanceType = 5 | 4 | 3 | 2 | 1;

export interface IEvaluation {
  user: Types.ObjectId;
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  phone?: string;
  checkInDate: Date;
  checkOutDate: Date;
  firstTime: firstTimeType;
  frontDeskOfficePerformance?: performanceType;
  staffPerformance?: performanceType;
  spaPerformance?: performanceType;
  roomsPerformance?: performanceType;
  resturantPerformance?: performanceType;
  fitnessCenterPerformance?: performanceType;
  overallPerformance?: performanceType;
}

export const evaluationSchema = new Schema<IEvaluation>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  firstName: String,
  lastName: String,
  emailAddress: String,
  phone: String,
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  firstTime: { type: String, required: true },
  frontDeskOfficePerformance: Number,
  staffPerformance: Number,
  spaPerformance: Number,
  roomsPerformance: Number,
  resturantPerformance: Number,
  fitnessCenterPerformance: Number,
  overallPerformance: Number,
});

export const Evaluation = model<IEvaluation>("Evaluation", evaluationSchema);
