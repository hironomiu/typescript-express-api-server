import { Router, Request, Response, NextFunction } from 'express'
import passport from 'passport'
import bcrypt from 'bcrypt'
import { createUser } from '../../models/User'
import { checkAuthentication } from '../../authPassport'
import {
  validator,
  checkEmailIsEmpty,
  checkEmailFormat,
} from '../../middlewares/validator'

const auth = Router()

// ユーザ登録
auth.post(
  '/signup',
  [checkEmailIsEmpty, checkEmailFormat],
  validator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const saltRounds = 10
      const hashPassword: string = await new Promise((resolve, reject) =>
        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
          if (err) reject({ message: 'hashed error', err: err })
          resolve(hash)
        })
      )
      const ret = await createUser({ ...req.body, hashPassword })
      return res.json({
        isSuccess: true,
        message: 'success',
        insertId: ret[0].insertId,
      })
    } catch (err) {
      console.log('/signup error:', err)
      return res.status(400).json({ isSuccess: false, message: 'fail' })
    }
  }
)

// ログイン状態確認
auth.get('/signin', checkAuthentication, (req, res) => {
  res.json({ isSuccess: true, message: 'success' })
})

// ログイン
auth.post(
  '/signin',
  [checkEmailIsEmpty, checkEmailFormat],
  validator,
  // TODO 型
  (req: any, res: Response, next: NextFunction) => {
    passport.authenticate('local', { session: true }, (err, user, info) => {
      if (err) return next(err)
      // infoではなく別途メッセージをレスポンス
      if (!user)
        return res.status(400).json({ isSuccess: false, message: '認証エラー' })
      // TODO ログイン後の状態を持つのに妥当か確認
      req.session.userId = user.id
      req.session.username = user.name
      req.session.email = user.email
      res.json(user)
      return next()
    })(req, res, next)
  }
)

// ログアウト
auth.post('/signout', (req: any, res, next) => {
  req.session.user = ''
  res.clearCookie('session')
  res.json({ message: 'signouted' })
})
export default auth
