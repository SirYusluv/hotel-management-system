import { EMAIL_PATTERN } from "../util/data";
import { User } from "./user-schema";
import * as bcrypt from "bcrypt";

export async function createUser(
  firstName: string,
  lastName: string,
  emailAddress: string,
  password: string
) {
  try {
    if (
      firstName.length < 1 ||
      lastName.length < 1 ||
      !emailAddress.match(EMAIL_PATTERN) ||
      password.length < 7
    )
      throw new Error("Invalid data provided.:::400");

    return await new User({
      firstName,
      lastName,
      emailAddress,
      password: await bcrypt.hash(password, 12),
    }).save();
  } catch (err: any) {
    if (err.code === 11000) {
      throw new Error("Email address is already in use.:::400");
    }

    console.error(err);
    throw err;
  }
}
