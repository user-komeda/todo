/* eslint-disable new-cap */
import mongoose from "mongoose";
/**
 * folder Schema
 */
const Folder = mongoose.Schema({
  folderName: "string",
  createAt: { type: Date, default: new Date() },
});
export default mongoose.model("Folder", Folder);
