const crypto = require('crypto')
const nodemailer = require('nodemailer')
const PasswordReset = require('./schema/password_reset')
const appKey = 'secretKey'
const APP_URL = 'https://komedatodoapp.herokuapp.com'
const sendgrid = require('sendgrid')(
  'SG.rJS4dnpOTkOF901dC_UJGg.MgSq4q-glAFMe4l0u2X1Gi9VuTO0CFmC5R11RFste94'
)

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: false,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: 'shinnnosukek@gmail.com',
    pass: 'anikosama9219',
  },
})
const signupMail = (id, email, req, res) => {
  const hash = crypto.createHash('sha1').update(email).digest('hex')
  const now = new Date()
  const expiration = now.setHours(now.getHours() + 1) // 1時間だけ有効
  let verificationUrl =
    req.get('origin') + '/verify/' + id + '/' + hash + '?expires=' + expiration
  const signature = crypto
    .createHmac('sha256', appKey)
    .update(verificationUrl)
    .digest('hex')
  verificationUrl += '&signature=' + signature
  const email = new sendgrid.Email()
  email.addTo(email)
  email.setFrom('shigoto922@gmail.com')
  email.setSubject('本登録メール')
  email.setHtml(
    '以下のurlをクリックして本登録を完了させてください。\n\n' + verificationUrl
  )
  sendgrid.send(email)
  return res.json({
    result: true,
  })
}
const resetPassMails = (email, res, req) => {
  const randomStr = Math.random().toFixed(36).substring(2, 38)
  const token = crypto
    .createHmac('sha256', appKey)
    .update(randomStr)
    .digest('hex')
  const passwordResetUrl = APP_URL + '/reset-pass/' + token
  PasswordReset.findOneAndUpdate(
    { email: email },
    { $set: { email: email, token: token, createAt: new Date() } },
    { upsert: true, new: true, useFindAndModify: false },
    (err, date) => {
      if (err) {
        throw err
      }
      if (!date) {
        passwordReset.token = token
        passwordReset.email = email
        passwordReset.createAt = newDate()
      }
    }
  )
  // req.session.user = { token: token }
  const email = new sendgrid.Email()
  email.addTo(email)
  email.setFrom('shigoto922@gmail.com')
  email.setSubject('パスワード再発行メール')
  email.setHtml(
    '以下のurlをクリックしてパスワードを再発行してください。\n\n' +
      passwordResetUrl
  )
  sendgrid.send(email)
  return res.json({
    result: true,
  })
}
module.exports = { signupMail, resetPassMails }
