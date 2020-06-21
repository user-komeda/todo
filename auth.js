const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./schema/users')

passport.use(
  new LocalStrategy(
    {
      usernameField: 'mail',
      passwordField: 'password',
    },
    (email, password, done) => {
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          return done(err)
        }
        if (!user) {
          return done(null, false, {
            message: 'メールアドレスが一致しません',
          })
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, {
            message: 'パスワードが一致しません',
          })
        }
        return done(null, user)
      })
    }
  )
)
passport.serializeUser((user, done) => {
  done(null, user._id)
})
passport.deserializeUser((id, done) => {
  User.findOne({ _id: id }, (err, user) => {
    done(err, user)
  })
})

module.exports = passport
