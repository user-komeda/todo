const mongoose = require('mongoose')
const Task = mongoose.Schema({
  folderId: 'ObjectId',
  title: 'string',
  status: 'number',
  due_date: 'string',
  createAt: { type: Date, default: new Date() },
})
module.exports = mongoose.model('task', Task)
