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

export const checkPasswordIsEmpty = check('password')
  .not()
  .isEmpty()
  .withMessage('passwordは必須項目です。')

export const checkPasswordIsMinLength = check('password')
  .isLength({ min: 8 })
  .withMessage('passwordは最低8文字以上必須です。')

export const validator = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const messages = errors.array()
    return res.status(422).json({ isSuccess: false, message: messages[0].msg })
  }
  return next()
}

// notification validator

export const checkNotificationIdIsEmpty = check('id')
  .not()
  .isEmpty()
  .withMessage('idは必須項目です。')

export const checkNotificationIdIsNumber = check('id')
  .isNumeric()
  .withMessage('idは数値です。')
