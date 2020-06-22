const express = require('express')
const router = express.Router({ mergeParams: true })
const PasswordReset = require('../schema/password_reset')
const bcrypt = require('bcrypt')
const Users = require('../schema/users')
/* GET home page. */
router.get('/', (req, res, next) => {
  console.log(req.params.token)
  return res.render('reset_pass', {
    token: req.params.token,
  })
})
router.post('/', (req, res, next) => {
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
    if (data[0] && data[0].token === token && data[0].email === email) {
      console.log(err)
      Users.updateOne(
        { email: email },
        { $set: { password: bcrypt.hashSync(password, 10) } },
        (err, result) => {
          if (err) {
            throw err
          }
          if (result) {
            PasswordReset.deleteMany()
            res.redirect('/login')
          }
        }
      )
    }
  })
})
module.exports = router
