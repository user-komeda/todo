/* eslint-disable new-cap */
import { Router } from "express";
const router = Router({ mergeParams: true });
import Users from "../schema/users.js";
import { createHash, createHmac } from "crypto";
const APP_URL = "https://komedatodoapp.herokuapp.com";
const APP_KEY = "secretKey";

// 認証ページ
router.get("/", (req, res, next) => {
  const id = req.params.id;
  Users.findOne({ _id: id }, (err, result) => {
    if (err) {
      throw err;
    }
    if (!result) {
      res.status(422).send("このurlは正しくありません");
    } else if (result.get("emailVerifiedAt")) {
      const id = result.get("_id");
      req.login(result, () => {
        return res.redirect(`/folders/${id}/tasks`);
      });
    } else {
      const nowDate = new Date();
      const hash = createHash("sha1").update(result.get("email")).digest("hex");
      const isCorrectHash = hash === req.params.hash;
      const isExpired = nowDate.getTime() < parseInt(req.query.expires);
      const validationUrl = APP_URL + req.originalUrl.split("&signature")[0];
      const signature = createHmac("sha256", APP_KEY)
        .update(validationUrl)
        .digest("hex");
      const isCorrectSignature = signature === req.query.signature;
      if (!isCorrectHash || !isExpired || !isCorrectSignature) {
        res.status(422).send("urlが正しくありません");
      } else {
        Users.updateOne(
          { emailVerifiedAt: null },
          { $set: { emailVerifiedAt: new Date() } },
          (err) => {
            if (err) {
              throw err;
            }
          }
        );
        const id = result.get("_id");
        req.login(result, () => {
          return res.redirect(`/folders/${id}/tasks`);
        });
      }
    }
  });
});

export default router;
