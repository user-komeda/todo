/* eslint-disable new-cap */
import { Router } from "express";
const router = Router();

/* topページ表示 */
router.get("/", (req, res, next) => {
  return res.redirect("/folders/1/tasks");
});
export default router;
