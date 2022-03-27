/* eslint-disable new-cap */
import { Router } from "express";
const router = Router();
import passport from "../auth.js";
import Users from "../schema/users.js";

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("login");
});
router.post("/", passport.authenticate("local"), (req, res, next) => {
  Users.findOne({ _id: req.session.passport.user }, (err, result) => {
    if (err || !result || !req.session) {
      return res.redirect("/login");
    } else {
      req.session.user = { username: result.username };
      return res.redirect(`/folders/1/tasks`);
    }
  });
});
export default router;
