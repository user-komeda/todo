const mongoose = require('mongoose')
const Folder = mongoose.Schema({
  folderName: 'string',
  createAt: { type: Date, default: new Date() },
})
module.exports = mongoose.model('Folder', Folder)
