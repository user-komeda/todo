/* eslint-disable new-cap */
import mongoose from "mongoose";
/**
 * PasswordReset schema
 */
const PasswordReset = mongoose.Schema({
  email: "string",
  token: "string",
  createAt: { type: Date, default: new Date() },
});
export default mongoose.model("PasswordReset", PasswordReset);
