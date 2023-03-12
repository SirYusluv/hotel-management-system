import { model, Schema } from "mongoose";

export interface IContactUs {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  message: string;
}

export const contactUsSchema = new Schema<IContactUs>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  emailAddress: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  message: { type: String, required: true },
});

export const ContactUs = model<IContactUs>("ContactUs", contactUsSchema);
