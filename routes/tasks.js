/* eslint-disable new-cap */
import { Router } from "express";
const router = Router({ mergeParams: true });
import Folder from "../schema/folder.js";

// タスクページ表示
router.get("/", (req, res, next) => {
  const id = req.params.id;
  if (!req.session.user) {
    return res.redirect("/login");
  }

  Folder.aggregate([
    {
      $lookup: {
        from: "tasks",
        localField: "_id",
        foreignField: "folderId",
        as: "profile",
      },
    },
    { $unwind: "$profile" },
  ]).exec((err, dates) => {
    if (err) {
      throw err;
    }
    Folder.find({}, (err, results) => {
      let index = 0;
      const key = [];
      for (const result of dates) {
        if (result._id.toString() === id.toString()) {
          key.push(index);
        }
        index++;
      }
      if (err) {
        throw err;
      }
      if (dates) {
        return res.render("tasks_view", {
          folders: results,
          tasks: dates,
          keys: key,
          id: id,
        });
      } else {
        return res.render("tasks_view", {
          id: id,
        });
      }
    });
  });
});

export default router;
