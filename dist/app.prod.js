"use strict";
var createError = require("http-errors"),
  express = require("express"),
  path = require("path"),
  cookieParser = require("cookie-parser"),
  logger = require("morgan"),
  sassMiddleware = require("node-sass-middleware"),
  signupRouter = require("./routes/signup"),
  app = express();
app.set("views", path.join(__dirname, "views")),
  app.set("view engine", "pug"),
  app.use(
    sassMiddleware({
      src: path.join(__dirname, "scss/page"),
      dest: path.join(__dirname, "public/stylesheets/dist"),
      indentedSyntax: !1,
      sourceMap: !1,
      debug: !0,
    })
  ),
  console.log(path.join(__dirname, "public")),
  app.use(logger("dev")),
  app.use(express.json()),
  app.use(express.urlencoded({ extended: !1 })),
  app.use(cookieParser()),
  app.use(express.static(path.join(__dirname, "public"))),
  app.use("/signup", signupRouter),
  app.use(function (e, s, r) {
    r(createError(404));
  }),
  app.use(function (e, s, r, p) {
    (r.locals.message = e.message),
      (r.locals.error = "development" === s.app.get("env") ? e : {}),
      r.status(e.status || 500),
      r.render("error");
  }),
  (module.exports = app);
