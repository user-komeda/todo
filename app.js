// "build": "npm-run-all lint scss-compile start",

import createError from "http-errors";
import express from "express";
import { join } from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import mongoose from "mongoose";
import session from "express-session";
import passport from "./auth.js";
import indexRouter from "./routes/index.js";
import signupRouter from "./routes/signup.js";
import loginRouter from "./routes/login.js";
import forgatPassRouter from "./routes/forgat_pass.js";
import resetPassRouter from "./routes/reset_pass.js";
import tasksRouter from "./routes/tasks.js";
import createFolderRouter from "./routes/create_folder.js";
import createTaskRouter from "./routes/create_task.js";
import editTaskRouter from "./routes/edit_task.js";
import mainRegistration from "./routes/main_registration.js";
import { default as connectMongoDBSession } from "connect-mongodb-session";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
  uri: "mongodb://127.0.0.1:27017/myDB",
  collection: "mySessions",
});
const app = express();

// view engine setup
app.set("views", join(__dirname, "views"));
app.set("view engine", "pug");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: true,
      secure: false,
      maxage: 1000 * 60 * 30,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/", indexRouter);
app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/forgat-pass", forgatPassRouter);
app.use("/reset-pass/:token", resetPassRouter);
app.use("/folders/:id/tasks", tasksRouter);
app.use("/folders/create", createFolderRouter);
app.use("/folders/:id/create/tasks", createTaskRouter);
app.use("/folders/:id/tasks/:taskid/edit", editTaskRouter);
app.use("/verify/:id/:hash", mainRegistration);

mongoose.connect("mongodb://127.0.0.1:27017/myDB", (err) => {
  if (err) {
    console.error(err);
    console.error(err);
  } else {
    console.log("success");
  }
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
