const express = require('express')
const router = express.Router()
const Folder = require('../schema/folder')

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('create_folder_view')
})
router.post('/', (req, res, next) => {
  const folderName = req.body.folder_name
  Folder.find({ folderName: folderName }, (err, result) => {
    if (err) {
      throw err
    }
    if (result.length > 0) {
      return res.status(422).json({
        errors: [
          {
            value: folderName,
            msg: '既に登録されています',
            param: 'folderName',
            location: 'body',
          },
        ],
      })
    } else {
      const newFolder = new Folder({
        folderName: folderName,
        createAt: new Date(),
      })
      newFolder.save((err) => {
        if (err) {
          throw err
        }
        Folder.findOne({ folderName: folderName }, (err, result) => {
          if (err) {
            throw err
          } else {
            const id = result.get('_id')
            return res.redirect(`/folders/${id}/tasks`)
          }
        })
      })
    }
  })
})

module.exports = router
