import { compareSync } from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import users from "./schema/users.js";

// 認証設定
passport.use(
  new LocalStrategy(
    {
      usernameField: "mail",
      passwordField: "password",
    },
    (email, password, done) => {
      users.findOne({ email: email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: "メールアドレスが一致しません",
          });
        }
        if (!compareSync(password, user.password)) {
          return done(null, false, {
            message: "パスワードが一致しません",
          });
        }
        return done(null, user);
      });
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser((id, done) => {
  users.findOne({ _id: id }, (err, user) => {
    done(err, user);
  });
});

export default passport;
