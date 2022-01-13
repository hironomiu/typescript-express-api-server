import { check, validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'

// users validator
export const checkEmailIsEmpty = check('email')
  .not()
  .isEmpty()
  .withMessage('emailは必須項目です。')

export const checkEmailFormat = check('email')
  .isEmail()
  .withMessage('emailのフォーマットではありません。')

export const validator = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body)
  const errors = validationResult(req)
  console.log(errors)
  if (!errors.isEmpty()) {
    const messages = errors.array()
    return res.status(422).json({ isSuccess: false, message: messages[0].msg })
  }
  return next()
}
