const express = require('express')
const router = express.Router({ mergeParams: true })
const PasswordReset = require('../schema/password_reset')
const validationRules = require('../varidate_rule')
const { validationResult } = require('express-validator')

const bcrypt = require('bcrypt')
const Users = require('../schema/users')
/* GET home page. */
router.get('/', (req, res, next) => {
  return res.render('reset_pass', {
    token: req.params.token,
  })
})
router.post(
  '/',
  validationRules.validateResetPassFormRules,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const email = req.body.mail
    const password = req.body.password
    const token = req.body.token
    PasswordReset.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'email',
          foreignField: 'email',
          as: 'profile',
        },
      },
      { $unwind: '$profile' },
    ]).exec((err, data) => {
      if (err) {
        throw err
      }
      if (data[0] && data[0].token === token && data[0].email === email) {
        Users.updateOne(
          { email: email },
          { $set: { password: bcrypt.hashSync(password, 10) } },
          (err, result) => {
            if (err) {
              throw err
            }
            if (result) {
              PasswordReset.deleteMany()
              return res.redirect('/login')
            }
          }
        )
      }
    })
  }
)
module.exports = router
