/* eslint-disable new-cap */
// TODO 本登録用のルーティング
import { Router } from "express";
const router = Router();
import Users from "../schema/users.js";
import { hashSync } from "bcrypt";
import { validateSigunupFormRules } from "../varidate_rule.js";
import { validationResult } from "express-validator";
import mailConfig from "../mailConfig.js";

// signupPage表示
router.get("/", (req, res, next) => {
  res.render("signup", { title: "Express" });
});

// signupPage リクエスト
router.post("/", validateSigunupFormRules, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const username = req.body.username;
  const hashedPassword = hashSync(req.body.password, 10);
  const email = req.body.mail;
  const date = new Date();
  const newUser = new Users({
    username: username,
    password: hashedPassword,
    email: email,
    createAt: date,
  });
  Users.find({ email: email }, (err, result) => {
    if (err) {
      throw err;
    }
    if (result.length > 0) {
      return res.status(422).json({
        errors: [
          {
            value: req.body.mail,
            msg: "既に登録されています",
            param: "email",
            location: "body",
          },
        ],
      });
    } else {
      newUser.save((err) => {
        if (err) {
          throw err;
        } else {
          Users.findOne({ email: email }, (err, result) => {
            if (err) {
              throw err;
            }
            const id = result.get("_id");
            mailConfig.signupMail(id, email, req, res);
          });
          // return res.redirect('/folders/1/tasks')
        }
      });
    }
  });
});

export default router;
