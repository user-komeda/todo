/* eslint-disable new-cap */
import mongoose from "mongoose";

/**
 * Task Schema
 */
const Task = mongoose.Schema({
  folderId: "ObjectId",
  title: "string",
  status: "number",
  due_date: "string",
  createAt: { type: Date, default: new Date() },
});
export default mongoose.model("task", Task);
