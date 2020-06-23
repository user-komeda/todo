const express = require('express')
const router = express.Router()
const MailConfig = require('../mailConfig')
const validationRules = require('../varidate_rule')
const { validationResult } = require('express-validator')

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('forgat_pass')
})

router.post(
  '/',
  validationRules.validateForgatPassFormRules,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const email = req.body.mail
    MailConfig.resetPassMails(email, res)
    req.session.user = { test: 'test' }
  }
)

module.exports = router
