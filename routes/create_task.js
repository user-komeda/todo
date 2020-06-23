const express = require('express')
const router = express.Router({ mergeParams: true })
const Task = require('../schema/tasks')
const validationRules = require('../varidate_rule')
const { validationResult } = require('express-validator')

/* GET home page. */
router.get('/', (req, res, next) => {
  const folderId = req.params.id
  res.render('create_task_view', {
    folderId: folderId,
  })
})
router.post(
  '/',
  validationRules.validateCreateTaskFormRules,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const taskName = req.body.task_name
    const limitTask = req.body.date_limit
    const date = new Date(limitTask)
    const limitDate = `${date.getFullYear()}/${
      date.getMonth() + 1
    }/${date.getDate()}`

    const folderId = req.body.folder_id
    Task.find({ title: taskName }, (err, result) => {
      if (err) {
        throw err
      }
      if (result.length > 0) {
        return res.status(422).json({
          errors: [
            {
              value: taskName,
              msg: '既に登録されています',
              param: 'taskName',
              location: 'body',
            },
          ],
        })
      } else {
        const newTask = new Task({
          folderId: folderId + '',
          title: taskName,
          status: 0,
          due_date: limitDate,
          createAt: new Date(),
        })
        newTask.save((err) => {
          if (err) {
            throw err
          }
          return res.redirect(`/folders/${folderId}/tasks`)
        })
      }
    })
  }
)

module.exports = router
