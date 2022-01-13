import { check, validationResult } from 'express-validator'

// users validator
export const checkEmailIsEmpty = check('email')
  .not()
  .isEmpty()
  .withMessage('emailは必須項目です。')

export const checkEmailFormat = check('email')
  .isEmail()
  .withMessage('emailのフォーマットではありません。')

// TODO 型
export const validator = (req: any, res: any, next: any) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const messages = errors.array()
    return res.status(422).json({ isSuccess: false, message: messages[0].msg })
  }
}
