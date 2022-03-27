/* eslint-disable new-cap */
import { Router } from "express";
const router = Router({ mergeParams: true });
import PasswordReset from "../schema/password_reset.js";
import { validateResetPassFormRules } from "../varidate_rule.js";
import { validationResult } from "express-validator";

import { hashSync } from "bcrypt";
import Users from "../schema/users.js";
/* GET home page. */
router.get("/", (req, res, next) => {
  return res.render("reset_pass", {
    token: req.params.token,
  });
});
router.post("/", validateResetPassFormRules, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const email = req.body.mail;
  const password = req.body.password;
  const token = req.body.token;
  PasswordReset.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "email",
        foreignField: "email",
        as: "profile",
      },
    },
    { $unwind: "$profile" },
  ]).exec((err, data) => {
    if (err) {
      throw err;
    }
    if (data[0] && data[0].token === token && data[0].email === email) {
      Users.updateOne(
        { email: email },
        { $set: { password: hashSync(password, 10) } },
        (err, result) => {
          if (err) {
            throw err;
          }
          if (result) {
            PasswordReset.deleteMany();
            return res.redirect("/login");
          }
        }
      );
    }
  });
});
export default router;
