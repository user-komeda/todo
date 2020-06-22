const mongoose = require('mongoose')
const PasswordReset = mongoose.Schema({
  email: 'string',
  token: 'string',
  createAt: { type: Date, default: new Date() },
})
module.exports = mongoose.model('PasswordReset', PasswordReset)
