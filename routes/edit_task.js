const express = require('express')
const router = express.Router({ mergeParams: true })
const Task = require('../schema/tasks')
const validationRules = require('../varidate_rule')
const { validationResult } = require('express-validator')

/* GET home page. */
router.get('/', (req, res, next) => {
  const taskId = req.params.taskid
  const folderId = req.params.id
  Task.findOne({ _id: taskId }, (err, result) => {
    if (err) {
      throw err
    }
    res.render('edit_task_view', {
      taskId: taskId,
      folderId: folderId,
      taskTitle: result.get('title'),
      taskLimit: result.get('due_date'),
    })
  })
})
router.post(
  '/',
  validationRules.validateEditTaskFormRules,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const taskName = req.body.task_name
    let status = req.body.status
    const limitTask = req.body.date_limit
    const taskId = req.params.taskid
    const folderId = req.params.id
    switch (status) {
      case '未着手':
        status = 0
        break
      case '着手':
        status = 1
        break
      case '完了':
        status = 2
        break
    }
    Task.updateOne(
      { _id: taskId },
      { $set: { title: taskName, status: status, due_date: limitTask } },
      (err, result) => {
        if (err) {
          throw err
        }
        return res.redirect(`/folders/${folderId}/tasks`)
      }
    )
  }
)

module.exports = router
