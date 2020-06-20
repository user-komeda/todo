const crypto = require('crypto')
const nodemailer = require('nodemailer')
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
const test = (id, email, req, res) => {
  const appKey = 'secretKey'
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
    from: 'shinnnosukek@gmail.com',
    to: 'shigoto922@gmail.com',
    text:
      '以下のURLをクリックして本登録を完了させてください。\n\n' +
      verificationUrl,
    subject: '本登録メール',
  })
  return res.json({
    result: true,
  })
}
module.exports = test
