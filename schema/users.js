const mongoose = require('mongoose')
const Users = mongoose.Schema({
  username: 'string',
  password: 'string',
  email: 'string',
  createAt: { type: Date, default: new Date() },
  emailVerifiedAt: { type: Date, default: null },
})
module.exports = mongoose.model('Users', Users)
