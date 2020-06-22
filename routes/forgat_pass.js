const express = require('express')
const router = express.Router()
const MailConfig = require('../mailConfig')

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('forgat_pass')
})

router.post('/', (req, res, next) => {
  const email = req.body.mail
  MailConfig.resetPassMails(email, res)
  req.session.user = { test: 'test' }
})

module.exports = router
