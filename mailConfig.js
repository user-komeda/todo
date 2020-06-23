const crypto = require('crypto')
const nodemailer = require('nodemailer')
const PasswordReset = require('./schema/password_reset')
const appKey = 'secretKey'
const APP_URL = 'http://localhost:3000'
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

  // 本登録メールを送信
  transporter.sendMail({
    from: 'shigoto922@gmail.com',
    to: email,
    text:
      '以下のURLをクリックして本登録を完了させてください。\n\n' +
      verificationUrl,
    subject: '本登録メール',
  })
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
  transporter.sendMail({
    from: 'Shigoto922@gmail.com',
    to: email,
    text:
      '以下のURLをクリックしてパスワードを再発行してください。\n\n' +
      passwordResetUrl,
    subject: 'パスワード再発行メール',
  })
  return res.json({
    result: true,
  })
}
module.exports = { signupMail, resetPassMails }
