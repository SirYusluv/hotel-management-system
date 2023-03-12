import { model, Schema } from "mongoose";

export interface INewsLetter {
  emailAddress: string;
}

export const newsLetterSchema = new Schema<INewsLetter>({
  emailAddress: { type: String, required: true, unique: true },
});

export const NewsLetter = model<INewsLetter>("NewsLetter", newsLetterSchema);
