const express = require('express')
const router = express.Router()
const passport = require('../auth')
const Users = require('../schema/users')
// const flash = require('connect-flash')

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('login')
})
router.post('/', passport.authenticate('local'), (req, res, next) => {
  Users.findOne({ _id: req.session.passport.user }, (err, result) => {
    if (err || !result || !req.session) {
      return res.redirect('/login')
    } else {
      req.session.user = { username: result.username }
      return res.redirect(`/folders/1/tasks`)
    }
  })
})
module.exports = router
