/* eslint-disable new-cap */
import mongoose from "mongoose";

/**
 * users schema
 */
const Users = mongoose.Schema({
  username: "string",
  password: "string",
  email: "string",
  createAt: { type: Date, default: new Date() },
  emailVerifiedAt: { type: Date, default: null },
});
export default mongoose.model("Users", Users);
