// TODO 本登録用のルーティング
const express = require('express')
const router = express.Router()
const Users = require('../schema/users')
const bcrypt = require('bcrypt')
const varidationRules = require('../varidate_rule')
const { validationResult } = require('express-validator')
const mailConfig = require('../mailConfig')
/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('signup', { title: 'Express' })
})

router.post('/', varidationRules, (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  const username = req.body.username
  const hashedPassword = bcrypt.hashSync(req.body.password, 10)
  const email = req.body.mail
  console.log(email)
  const date = new Date()
  const newUser = new Users({
    username: username,
    password: hashedPassword,
    email: email,
    createAt: date,
  })
  Users.find({ email: email }, (err, result) => {
    if (err) {
      throw err
    }
    if (result.length > 0) {
      return res.status(422).json({
        errors: [
          {
            value: req.body.mail,
            msg: '既に登録されています',
            param: 'email',
            location: 'body',
          },
        ],
      })
    } else {
      newUser.save((err) => {
        if (err) {
          throw err
        } else {
          Users.findOne({ email: email }, (err, result) => {
            if (err) {
              throw err
            }
            const id = result.get('_id')
            mailConfig.signupMail(id, email, req, res)
          })
          // return res.redirect('/folders/1/tasks')
        }
      })
    }
  })
})

module.exports = router
