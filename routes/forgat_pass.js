/* eslint-disable new-cap */
import { Router } from "express";
const router = Router();
import MailConfig from "../mailConfig.js";
import { validateForgatPassFormRules } from "../varidate_rule.js";
import { validationResult } from "express-validator";

// パスワード再設定ページ
router.get("/", (req, res, next) => {
  res.render("forgat_pass");
});

// パスワード再設定リクエスト
router.post("/", validateForgatPassFormRules, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const email = req.body.mail;
  MailConfig.resetPassMails(email, res);
  req.session.user = { test: "test" };
});

export default router;
