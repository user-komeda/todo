const express = require('express')
const router = express.Router()
const Folder = require('../schema/folder')

/* GET home page. */
router.get('/', (req, res, next) => {
  Folder.find({}, (err, result) => {
    if (err) {
      throw err
    }
    if (result.length > 0) {
      res.render('tasks_view', {
        folders: result,
      })
    }
  })
})

module.exports = router
