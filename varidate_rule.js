const { check } = require('express-validator')

const validateSigunupFormRules = [
  check('username').not().isEmpty().withMessage('この項目は入力必須です'),
  check('password')
    .not()
    .isEmpty()
    .withMessage('この項目は入力必須です')
    .isLength({ min: 8, max: 25 })
    .withMessage('8文字から25文字で入力してください')
    .matches(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,25}$/)
    .withMessage('パスワードには小文字大文字数字を含めてください')
    .custom((value, { req }) => {
      if (req.body.password !== req.body.passwordConfirmation) {
        throw new Error('パスワード（確認）と一致しません。')
      }
      return true
    }),
  check('mail')
    .not()
    .isEmpty()
    .withMessage('この項目は入力必須です')
    .isEmail()
    .withMessage('有効なメールアドレス形式で入力して下さい'),
]
const validateResetPassFormRules = [
  check('password')
    .not()
    .isEmpty()
    .withMessage('この項目は入力必須です')
    .isLength({ min: 8, max: 25 })
    .withMessage('8文字から25文字で入力してください')
    .matches(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,25}$/)
    .withMessage('パスワードには小文字大文字数字を含めてください')
    .custom((value, { req }) => {
      if (req.body.password !== req.body.passwordConfirmation) {
        throw new Error('パスワード（確認）と一致しません。')
      }
      return true
    }),
  check('mail')
    .not()
    .isEmpty()
    .withMessage('この項目は入力必須です')
    .isEmail()
    .withMessage('有効なメールアドレス形式で入力して下さい'),
]
const validateForgatPassFormRules = [
  check('mail')
    .not()
    .isEmpty()
    .withMessage('この項目は入力必須です')
    .isEmail()
    .withMessage('有効なメールアドレス形式で入力して下さい'),
]
const validateEditTaskFormRules = [
  check('task_name').not().isEmpty().withMessage('この項目は入力必須です'),
  check('date_limit').not().isEmpty().withMessage('この項目は入力必須です'),
]
const validateCreateTaskFormRules = [
  check('task_name').not().isEmpty().withMessage('この項目は入力必須です'),
  check('date_limit').not().isEmpty().withMessage('この項目は入力必須です'),
]
const validateCreateFolderFormRules = [
  check('folder_name').not().isEmpty().withMessage('この項目は入力必須です'),
]
module.exports = {
  validateSigunupFormRules,
  validateResetPassFormRules,
  validateForgatPassFormRules,
  validateEditTaskFormRules,
  validateCreateTaskFormRules,
  validateCreateFolderFormRules,
}
