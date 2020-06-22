const express = require('express')
const router = express.Router()
const Folder = require('../schema/folder')

/* GET home page. */
router.get('/', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login')
  }
  Folder.find({}, (err, result) => {
    if (err) {
      throw err
    }
    if (result.length > 0) {
      res.render('tasks_view', {
        folders: result,
      })
    } else {
      return res.render('tasks_view')
    }
  })
})

module.exports = router
