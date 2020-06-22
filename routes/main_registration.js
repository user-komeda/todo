const express = require('express')
const router = express.Router({ mergeParams: true })
const Users = require('../schema/users')
const crypto = require('crypto')
const APP_URL = 'http://localhost:3000'
const APP_KEY = 'secretKey'

/* GET home page. */
router.get('/', (req, res, next) => {
  const id = req.params.id
  Users.findOne({ _id: id }, (err, result) => {
    if (err) {
      throw err
    }
    if (!result) {
      res.status(422).send('このurlは正しくありません')
    } else if (result.get('emailVerifiedAt')) {
      const id = result.get('_id')
      req.login(result, () => {
        return res.redirect(`/folders/${id}/tasks`)
      })
    } else {
      const nowDate = new Date()
      const hash = crypto
        .createHash('sha1')
        .update(result.get('email'))
        .digest('hex')
      const isCorrectHash = hash === req.params.hash
      const isExpired = nowDate.getTime() < parseInt(req.query.expires)
      const validationUrl = APP_URL + req.originalUrl.split('&signature')[0]
      const signature = crypto
        .createHmac('sha256', APP_KEY)
        .update(validationUrl)
        .digest('hex')
      const isCorrectSignature = signature === req.query.signature
      if (!isCorrectHash || !isExpired || !isCorrectSignature) {
        res.status(422).send('urlが正しくありません')
      } else {
        Users.updateOne(
          { emailVerifiedAt: null },
          { $set: { emailVerifiedAt: new Date() } },
          (err) => {
            if (err) {
              throw err
            }
          }
        )
        const id = result.get('_id')
        req.login(result, () => {
          return res.redirect(`/folders/${id}/tasks`)
        })
      }
    }
  })
})

module.exports = router
