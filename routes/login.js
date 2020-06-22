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
  Users.findOne({ _id: req.session.passport.user }, (err, user) => {
    if (err || !user || !req.session) {
      return res.redirect('/login')
    } else {
      req.session.user = { username: user.username }
      const id = user.get('_id')
      return res.redirect(`/folders/${id}/tasks`)
    }
  })
})
module.exports = router
